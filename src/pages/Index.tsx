import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="border-b border-blue-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              🎨
            </div>
            <h1 className="text-xl font-bold text-foreground">Artist Connect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut} size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant border-blue-100">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Welcome to Artist Connect
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Your creative community platform
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with creators, discover amazing artwork, and build your creative community.
                Share your work, follow your favorite creators, and explore a world of artistic inspiration.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mb-4 mx-auto">
                    🎨
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Share Your Art</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and showcase your creative work to the community
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mb-4 mx-auto">
                    👥
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Connect</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow other creators and build meaningful connections
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mb-4 mx-auto">
                    🛍️
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Discover</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore and support amazing artwork from creators worldwide
                  </p>
                </div>
              </div>

              <div className="pt-6">
                {/* You might want to link this button to your dashboard or messenger page */}
                <Button size="lg">
                  Start Exploring
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
