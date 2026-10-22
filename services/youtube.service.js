const CHANNEL_ID = 'UC-6J_2U9-yLT8SGD2RBGoPw';
const COMMUNITY_URL = `https://www.youtube.com/channel/${CHANNEL_ID}/community`;
const VIDEOS_URL = `https://www.youtube.com/channel/${CHANNEL_ID}/videos`;

let cachedPosts = null;
let lastPostsFetch = 0;
let cachedVideos = null;
let lastVideosFetch = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

function parseRelativeTimeToTimestamp(timeStr) {
  const now = Date.now();
  if (!timeStr) return now;
  const lower = timeStr.toLowerCase();

  const match = lower.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/);
  if (!match) {
    if (lower.includes('just now') || lower.includes('second')) return now;
    return now - 30 * 24 * 3600 * 1000;
  }
  const val = parseInt(match[1], 10);
  const unit = match[2];

  const mults = {
    second: 1000,
    minute: 60 * 1000,
    hour: 3600 * 1000,
    day: 24 * 3600 * 1000,
    week: 7 * 24 * 3600 * 1000,
    month: 30 * 24 * 3600 * 1000,
    year: 365 * 24 * 3600 * 1000,
  };
  return now - val * (mults[unit] || 86400000);
}

function toBengaliRelativeTime(timeStr) {
  if (!timeStr) return 'সম্প্রতি';
  const lower = timeStr.toLowerCase();
  const match = lower.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/);
  if (!match) return timeStr;

  const val = match[1];
  const unit = match[2];
  const bengaliDigits = val.replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

  const unitMap = {
    second: 'সেকেন্ড আগে',
    minute: 'মিনিট আগে',
    hour: 'ঘণ্টা আগে',
    day: 'দিন আগে',
    week: 'সপ্তাহ আগে',
    month: 'মাস আগে',
    year: 'বছর আগে',
  };

  return `${bengaliDigits} ${unitMap[unit] || 'দিন আগে'}`;
}

export async function fetchLiveCommunityPosts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedPosts && now - lastPostsFetch < CACHE_TTL_MS) {
    return cachedPosts;
  }

  try {
    const res = await fetch(COMMUNITY_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
      },
    });

    if (!res.ok) {
      throw new Error(`YouTube responded with status ${res.status}`);
    }

    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!match) {
      throw new Error('ytInitialData not found in YouTube response');
    }

    const data = JSON.parse(match[1]);
    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
    const postTab =
      tabs.find((t) => t.tabRenderer?.title === 'Posts' || t.tabRenderer?.title === 'Community') ||
      tabs[0];
    const sectionList = postTab?.tabRenderer?.content?.sectionListRenderer?.contents || [];

    const posts = [];
    for (const s of sectionList) {
      const items = s?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        const p = item?.backstagePostThreadRenderer?.post?.backstagePostRenderer;
        if (!p) continue;

        const text = p.contentText?.runs?.map((r) => r.text).join('') || '';
        const time = p.publishedTimeText?.runs?.map((r) => r.text).join('') || '';
        const timestamp = parseRelativeTimeToTimestamp(time);
        const timeBengali = toBengaliRelativeTime(time);
        const author = p.authorText?.runs?.map((r) => r.text).join('') || 'Spiritual ideology';
        let authorThumb = p.authorThumbnail?.thumbnails?.[0]?.url || '';
        if (authorThumb.startsWith('//')) authorThumb = 'https:' + authorThumb;

        const voteCount = p.voteCount?.simpleText || '০';
        const commentCount =
          p.actionButtons?.commentActionButtonsRenderer?.replyButton?.buttonRenderer?.text?.simpleText ||
          '০';
        const postId = p.postId;

        const images = [];
        const imageAttachment = p.backstageAttachment?.backstageImageRenderer?.image?.thumbnails;
        if (imageAttachment && imageAttachment.length > 0) {
          images.push(imageAttachment[imageAttachment.length - 1].url);
        }
        const postImages = p.backstageAttachment?.postMultiImageRenderer?.images;
        if (postImages) {
          for (const img of postImages) {
            const thumbs = img.backstageImageRenderer?.image?.thumbnails;
            if (thumbs && thumbs.length > 0) {
              images.push(thumbs[thumbs.length - 1].url);
            }
          }
        }

        let poll = null;
        const pollAttachment = p.backstageAttachment?.pollRenderer;
        if (pollAttachment) {
          const choices = pollAttachment.choices?.map((c) => ({
            text: c.text?.runs?.map((r) => r.text).join(''),
            voteRatio: c.voteRatioIfVoted || 0,
          }));
          poll = {
            choices,
            totalVotes: pollAttachment.totalVotes?.simpleText || '০',
          };
        }

        posts.push({
          id: postId,
          postId,
          author: author.trim(),
          authorThumb,
          time,
          timeBengali,
          timestamp,
          text,
          images,
          poll,
          voteCount,
          commentCount,
          postUrl: `https://www.youtube.com/post/${postId}`,
        });
      }
    }

    // Sort strictly descending by timestamp: latest post ALWAYS on top
    posts.sort((a, b) => b.timestamp - a.timestamp);

    cachedPosts = posts;
    lastPostsFetch = now;
    return posts;
  } catch (error) {
    console.error('[YouTube Service] Error fetching community posts:', error);
    if (cachedPosts) return cachedPosts;
    throw error;
  }
}

export async function fetchLiveChannelVideos(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedVideos && now - lastVideosFetch < CACHE_TTL_MS) {
    return cachedVideos;
  }

  try {
    const res = await fetch(VIDEOS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
      },
    });

    if (!res.ok) {
      throw new Error(`YouTube channel videos returned ${res.status}`);
    }

    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!match) {
      throw new Error('ytInitialData not found in YouTube channel videos response');
    }

    const data = JSON.parse(match[1]);

    function findLockups(obj, results = []) {
      if (!obj || typeof obj !== 'object') return results;
      if (obj.lockupViewModel && obj.lockupViewModel.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO') {
        results.push(obj.lockupViewModel);
      }
      for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'object') {
          findLockups(obj[k], results);
        }
      }
      return results;
    }

    const lockups = findLockups(data);
    const videos = [];

    for (const l of lockups) {
      const videoId =
        l.contentId ||
        l.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId;
      if (!videoId) continue;

      const metadata = l.metadata?.lockupMetadataViewModel;
      let title = metadata?.title?.content || '';
      if (!title && l.rendererContext?.accessibilityContext?.label) {
        title = l.rendererContext.accessibilityContext.label;
      }

      // Duration
      const overlays = l.contentImage?.thumbnailViewModel?.overlays || [];
      let duration = '';
      for (const o of overlays) {
        if (o.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text) {
          duration = o.thumbnailBottomOverlayViewModel.badges[0].thumbnailBadgeViewModel.text;
        } else if (o.thumbnailOverlayTimeStatusRenderer?.text?.runs?.[0]?.text) {
          duration = o.thumbnailOverlayTimeStatusRenderer.text.runs[0].text;
        }
      }

      // High quality thumbnail
      const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      // Views and published time
      const rows = metadata?.metadata?.contentMetadataViewModel?.metadataRows || [];
      let views = '';
      let publishedTime = '';
      if (rows.length > 0) {
        const parts = rows[0]?.metadataParts || [];
        if (parts[0]?.text?.content) views = parts[0].text.content;
        if (parts[1]?.text?.content) publishedTime = parts[1].text.content;
      }

      videos.push({
        id: videoId,
        videoId,
        title,
        duration: duration || 'ভিডিও',
        views: views ? `${views} ভিউস` : 'ভিউস',
        publishedTime: publishedTime || 'নতুন',
        thumb,
        channelTitle: 'Spiritual ideology',
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }

    if (videos.length > 0) {
      cachedVideos = videos;
      lastVideosFetch = now;
      return videos;
    }

    throw new Error('No videos found in YouTube channel tab');
  } catch (error) {
    console.error('[YouTube Service] Error fetching channel videos:', error);
    if (cachedVideos) return cachedVideos;
    throw error;
  }
}
