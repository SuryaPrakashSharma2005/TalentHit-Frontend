import React from "react";

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Global Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. Please try refreshing
              the page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}