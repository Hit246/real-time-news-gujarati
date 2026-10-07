import { getHomePosts, getCategories, getSiteSettings } from '@/lib/sanity/fetch';
import { HeroGrid } from '@/components/public/HeroGrid';
import { CategoryBlocks } from '@/components/public/CategoryBlocks';
import { LatestFeed } from '@/components/public/LatestFeed';
import { Sidebar } from '@/components/public/Sidebar';

export default async function HomePage() {
  const [posts, categories, settings] = await Promise.all([
    getHomePosts(),
    getCategories(),
    getSiteSettings(),
  ]);

  // Lead stories for Hero Grid (first 5 posts)
  const heroPosts = posts.slice(0, 5);
  // Remaining posts for Latest Feed
  const latestPosts = posts.slice(5);
  // Trending posts for sidebar
  const trendingPosts = posts;

  return (
    <div className="space-y-12">
      {/* 1. Hero Section (1 Large + 4 Small) */}
      <HeroGrid posts={heroPosts} />

      {/* 2. Two-Column Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column (8 cols): Category Blocks & Latest Feed */}
        <div className="lg:col-span-8 space-y-14">
          <CategoryBlocks categories={categories} posts={posts} />
          {latestPosts.length > 0 && <LatestFeed posts={latestPosts} />}
        </div>

        {/* Sidebar (4 cols): Trending, Newsletter, 1 Ad Slot */}
        <div className="lg:col-span-4">
          <Sidebar trendingPosts={trendingPosts} settings={settings} />
        </div>
      </div>
    </div>
  );
}
