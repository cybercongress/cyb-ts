import React, { Component } from 'react';
import ErrorScreen from './ErrorScreen/ErrorScreen';

interface Props {
  fallback?: JSX.Element;
  children: React.ReactNode;
}

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorScreen error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
