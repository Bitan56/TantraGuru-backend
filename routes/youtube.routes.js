import { Router } from 'express';
import { fetchLiveCommunityPosts, fetchLiveChannelVideos } from '../services/youtube.service.js';

const router = Router();

// GET /api/v1/youtube/community
router.get('/community', async (req, res, next) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const posts = await fetchLiveCommunityPosts(forceRefresh);
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/youtube/videos
router.get('/videos', async (req, res, next) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const videos = await fetchLiveChannelVideos(forceRefresh);
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
