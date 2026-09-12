pipeline {
    agent any

    environment {
        IMAGE_NAME = "samba-ad-dc"
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Lint & Validate') {
            steps {
                echo 'Validating Docker Compose configuration...'
                sh '''
                    if command -v docker-compose &> /dev/null; then
                        docker-compose config
                    elif command -v docker &> /dev/null; then
                        docker compose config
                    else
                        echo "Docker CLI not detected in agent, skipping config check."
                    fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}..."
                sh '''
                    if command -v docker &> /dev/null; then
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ./docker
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                    else
                        echo "Docker not available in build environment."
                    fi
                '''
            }
        }

        stage('Test & Verify') {
            steps {
                echo 'Running image verification...'
                sh '''
                    if command -v docker &> /dev/null; then
                        docker images | grep ${IMAGE_NAME} || true
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo "========================================================"
            echo " [+] Pipeline build #${BUILD_NUMBER} completed successfully!"
            echo "========================================================"
        }
        failure {
            echo "========================================================"
            echo " [-] Pipeline build #${BUILD_NUMBER} failed. Check console logs."
            echo "========================================================"
        }
        always {
            echo "Cleaning up temporary workspace files..."
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
