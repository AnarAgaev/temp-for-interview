import React from 'react'
import styles from './ErrorBoundary.module.scss'

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({hasError: true, error, errorInfo})
    }

    render() {
        const {hasError, error} = this.state
        if (hasError) {
            console.log('\x1b[31m%s\x1b[0m', error?.toString())

            const { container, title, subtitle, picture } = styles

            return (
                <div className={container}>
                    <h1 className={title}>Что-то пошло не так!</h1>
                    <p className={subtitle}>Попробуйте перезагрузить страницу или зайти на сайт немного позже.</p>
                    <img className={picture}
                        src="https://anaragaev.github.io/cdn/images/error.webp"
                        alt="Что-то пошло не так."/>
                </div>
            );
        }
        return this.props.children
    }
}

export default ErrorBoundary
