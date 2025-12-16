#!/bin/bash

# 🚀 Customer Satisfaction Survey - Deployment Helper Script

echo "🚀 Customer Satisfaction Survey - Deployment Helper"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking project structure..."
print_success "Project structure looks good!"

# Check for required files
print_status "Checking deployment configuration files..."

if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found!"
    exit 1
fi

if [ ! -f "render.yaml" ]; then
    print_error "render.yaml not found!"
    exit 1
fi

print_success "Deployment configuration files found!"

# Check environment files
print_status "Checking environment configuration..."

if [ ! -f "frontend/.env.example" ]; then
    print_warning "frontend/.env.example not found"
else
    print_success "Frontend environment example found"
fi

if [ ! -f "backend/.env.example" ]; then
    print_warning "backend/.env.example not found"
else
    print_success "Backend environment example found"
fi

# Test builds locally
echo ""
print_status "Testing local builds..."

# Test backend build
print_status "Testing backend build..."
cd backend
if npm run build; then
    print_success "Backend build successful!"
else
    print_error "Backend build failed!"
    cd ..
    exit 1
fi
cd ..

# Test frontend build
print_status "Testing frontend build..."
cd frontend
if npm run build; then
    print_success "Frontend build successful!"
else
    print_error "Frontend build failed!"
    cd ..
    exit 1
fi
cd ..

echo ""
print_success "🎉 All checks passed! Your project is ready for deployment."
echo ""
print_status "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Render using render.yaml"
echo "3. Deploy frontend to Vercel using vercel.json"
echo "4. Configure environment variables on both platforms"
echo ""
print_status "See DEPLOYMENT_INSTRUCTIONS.md for detailed steps"
echo ""
print_success "Happy deploying! 🚀"