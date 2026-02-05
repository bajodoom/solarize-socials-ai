import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Solarize Socials AI</h1>
          <nav className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          AI-Powered Social Media Automation
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Generate engaging content with A/B testing variations, create AI images, 
          integrate trending topics, and schedule posts across all your social platforms.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">Learn More</Button>
          </Link>
        </div>
      </section>

      <section id="features" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Content Generation</CardTitle>
                <CardDescription>
                  Generate multiple content variations for A/B testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create engaging posts optimized for each platform with GPT-4o. 
                  Get 3 variations per request for maximum engagement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Image Generation</CardTitle>
                <CardDescription>
                  DALL-E 3 powered image creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate stunning images for your posts with simple text prompts. 
                  High-quality 1024x1024 images perfect for social media.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Integration</CardTitle>
                <CardDescription>
                  Automatic trending topic detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay relevant by automatically incorporating trending topics 
                  and hashtags into your content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Scheduling</CardTitle>
                <CardDescription>
                  Visual calendar with drag-and-drop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schedule posts across multiple platforms with our intuitive 
                  calendar interface. Queue system ensures reliable delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Platform Support</CardTitle>
                <CardDescription>
                  Twitter, LinkedIn, Facebook & Instagram
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Publish to all major social platforms from one dashboard. 
                  Platform-specific optimization included.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track engagement and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor likes, shares, comments, and impressions across 
                  all your social accounts in one place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Solarize Socials AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
