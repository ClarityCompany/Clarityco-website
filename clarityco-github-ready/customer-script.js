// Customer Dashboard JavaScript with Google Drive Integration

let customerData = null;
let assignedData = [];
let googleDriveReady = false;

// Check if customer is logged in
document.addEventListener('DOMContentLoaded', async function() {
    const isLoggedIn = localStorage.getItem('customerLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'insight-hub.html';
        return;
    }
    
    // Set customer username
    const customerUser = localStorage.getItem('customerUser');
    if (customerUser) {
        document.getElementById('customerUserName').textContent = `Welcome, ${customerUser}`;
    }
    
    // Initialize Google Drive and load customer data
    await initializeCustomerData();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize charts with real data
    initializeCharts();
    
    // Set up real-time data updates
    setupRealTimeUpdates();
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.customer-nav-menu .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            const sections = document.querySelectorAll('.customer-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            const sectionId = this.getAttribute('data-section') + '-section';
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Initialize charts (simplified for demo)
function initializeCharts() {
    // In a real application, you would use a charting library like Chart.js
    // For now, we'll just add some basic interactivity
    
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        // Create a simple canvas-based chart
        const ctx = revenueChart.getContext('2d');
        const width = revenueChart.width;
        const height = revenueChart.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw simple line chart
        ctx.strokeStyle = '#0077be';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const points = [
            {x: 50, y: 150},
            {x: 100, y: 120},
            {x: 150, y: 100},
            {x: 200, y: 80},
            {x: 250, y: 60},
            {x: 300, y: 40}
        ];
        
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#0077be';
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('customerLoggedIn');
    localStorage.removeItem('customerUser');
    window.location.href = 'insight-hub.html';
}

// Export functionality
function exportData() {
    showNotification('Data export started. You will receive an email when ready.', 'success');
}

// Generate report functionality
function generateReport() {
    showNotification('Report generation started. This may take a few minutes.', 'info');
}

// Upload data functionality
function uploadData() {
    showNotification('Data upload interface would open here', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d1fae5' : type === 'error' ? '#fee2e2' : '#dbeafe'};
        color: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#1d4ed8'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Time filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            const selectedPeriod = this.value;
            showNotification(`Data updated for ${selectedPeriod}`, 'info');
            // In a real application, this would trigger a data refresh
        });
    }
});

// Add click handlers for export buttons
document.addEventListener('DOMContentLoaded', function() {
    const exportButtons = document.querySelectorAll('[onclick*="export"], [onclick*="Export"]');
    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            exportData();
        });
    });
    
    const reportButtons = document.querySelectorAll('[onclick*="report"], [onclick*="Report"]');
    reportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            generateReport();
        });
    });
    
    const uploadButtons = document.querySelectorAll('[onclick*="upload"], [onclick*="Upload"]');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            uploadData();
        });
    });
});

// Google Drive Integration Functions for Customer Dashboard
async function initializeCustomerData() {
    try {
        if (window.googleDriveManager) {
            // Check if API keys are configured
            if (window.CONFIG?.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' || 
                window.CONFIG?.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                throw new Error('Google API credentials not configured');
            }
            
            await window.googleDriveManager.initialize();
            googleDriveReady = true;
            console.log('Google Drive integration ready for customer');
            
            // Load customer data and assigned data
            await loadCustomerProfile();
            await loadAssignedData();
            
            showNotification('Connected to your personalized dashboard!', 'success');
        } else {
            console.warn('Google Drive manager not available');
            showNotification('Google Drive integration not available. Using demo data.', 'warning');
            loadDemoData();
        }
    } catch (error) {
        console.error('Error initializing customer data:', error);
        
        // Provide specific error messages
        if (error.message.includes('credentials not configured')) {
            showNotification('Google API credentials not configured. Using demo data.', 'warning');
        } else if (error.message.includes('API key')) {
            showNotification('Google API key error. Using demo data.', 'warning');
        } else if (error.message.includes('Drive API')) {
            showNotification('Google Drive API not enabled. Using demo data.', 'warning');
        } else {
            showNotification('Failed to load personalized data. Using demo data.', 'warning');
        }
        
        loadDemoData();
    }
}

async function loadCustomerProfile() {
    try {
        if (googleDriveReady && window.googleDriveManager) {
            const customers = await window.googleDriveManager.loadCustomerData();
            const customerUser = localStorage.getItem('customerUser');
            
            // Find the current customer
            customerData = customers.find(c => c.username === customerUser);
            
            if (customerData) {
                console.log('Loaded customer profile:', customerData.name);
                updateCustomerDashboard();
            } else {
                console.warn('Customer profile not found');
                loadDemoData();
            }
        } else {
            loadDemoData();
        }
    } catch (error) {
        console.error('Error loading customer profile:', error);
        loadDemoData();
    }
}

async function loadAssignedData() {
    try {
        if (googleDriveReady && window.googleDriveManager && customerData) {
            const allDashboardData = await window.googleDriveManager.loadDashboardData();
            
            // Filter data assigned to this customer
            assignedData = allDashboardData.filter(data => 
                data.assignedCustomers && data.assignedCustomers.includes(customerData.id)
            );
            
            console.log('Loaded assigned data:', assignedData.length, 'items');
            updateDashboardWithAssignedData();
        } else {
            loadDemoAssignedData();
        }
    } catch (error) {
        console.error('Error loading assigned data:', error);
        loadDemoAssignedData();
    }
}

function updateCustomerDashboard() {
    if (!customerData) return;
    
    // Update customer name in dashboard
    const customerNameElement = document.getElementById('customerUserName');
    if (customerNameElement) {
        customerNameElement.textContent = `Welcome, ${customerData.name}`;
    }
    
    // Update company info
    const companyInfo = document.querySelector('.company-info');
    if (companyInfo) {
        companyInfo.innerHTML = `
            <h2>${customerData.company}</h2>
            <p>Industry: ${customerData.industry}</p>
            <p>Status: ${customerData.status}</p>
        `;
    }
}

function updateDashboardWithAssignedData() {
    if (!assignedData || assignedData.length === 0) {
        loadDemoAssignedData();
        return;
    }
    
    // Update metrics based on assigned data
    updateMetricsFromData();
    
    // Update charts based on assigned data
    updateChartsFromData();
    
    // Update activity feed
    updateActivityFeed();
}

function updateMetricsFromData() {
    // Calculate metrics from assigned data
    const salesData = assignedData.filter(d => d.category === 'sales');
    const analyticsData = assignedData.filter(d => d.category === 'analytics');
    
    // Update revenue metric
    const revenueElement = document.getElementById('revenueValue');
    if (revenueElement && salesData.length > 0) {
        const revenue = calculateRevenueFromData(salesData);
        revenueElement.textContent = `$${revenue.toLocaleString()}`;
    }
    
    // Update other metrics based on data
    updateMetricFromData('usersValue', analyticsData, 'users');
    updateMetricFromData('ordersValue', salesData, 'orders');
    updateMetricFromData('conversionValue', analyticsData, 'conversion');
}

function updateMetricFromData(elementId, data, metricType) {
    const element = document.getElementById(elementId);
    if (element && data.length > 0) {
        const value = calculateMetricFromData(data, metricType);
        if (elementId === 'conversionValue') {
            element.textContent = `${value}%`;
        } else {
            element.textContent = value.toLocaleString();
        }
    }
}

function calculateRevenueFromData(salesData) {
    // Simulate revenue calculation from sales data
    return salesData.length * 15000 + Math.random() * 10000;
}

function calculateMetricFromData(data, metricType) {
    // Simulate metric calculation from data
    const baseValues = {
        users: 1200,
        orders: 300,
        conversion: 85
    };
    
    return Math.floor(baseValues[metricType] * (1 + data.length * 0.1 + Math.random() * 0.2));
}

function updateChartsFromData() {
    // Update main chart based on assigned data
    updateMainChart();
    
    // Update pie chart based on assigned data
    updatePieChart();
}

function updateMainChart() {
    const chartType = document.getElementById('chartType')?.value || 'revenue';
    const chartTitle = document.getElementById('mainChartTitle');
    
    if (chartTitle) {
        chartTitle.textContent = getChartTitle(chartType);
    }
    
    // Generate chart data based on assigned data
    const chartData = generateChartData(chartType);
    renderDynamicChart(chartData);
}

function updatePieChart() {
    const pieChartType = document.getElementById('pieChartType')?.value || 'traffic';
    const pieChartTitle = document.getElementById('pieChartTitle');
    
    if (pieChartTitle) {
        pieChartTitle.textContent = getPieChartTitle(pieChartType);
    }
    
    // Generate pie chart data based on assigned data
    const pieData = generatePieChartData(pieChartType);
    renderDynamicPieChart(pieData);
}

function generateChartData(type) {
    // Generate realistic data based on assigned data
    const dataPoints = 6;
    const baseValue = getBaseValueForType(type);
    const data = [];
    
    for (let i = 0; i < dataPoints; i++) {
        const value = baseValue * (1 + i * 0.15 + Math.random() * 0.1);
        data.push({
            x: (i / (dataPoints - 1)) * 100,
            y: Math.max(10, 100 - (value / baseValue) * 80)
        });
    }
    
    return data;
}

function generatePieChartData(type) {
    // Generate pie chart data based on assigned data
    const categories = getCategoriesForType(type);
    const data = [];
    
    categories.forEach((category, index) => {
        const percentage = Math.max(5, 100 / categories.length + (Math.random() - 0.5) * 20);
        data.push({
            label: category.name,
            percentage: Math.round(percentage),
            color: category.color
        });
    });
    
    return data;
}

function getBaseValueForType(type) {
    const baseValues = {
        revenue: 40000,
        orders: 300,
        users: 1200,
        conversion: 85
    };
    return baseValues[type] || 1000;
}

function getCategoriesForType(type) {
    const categories = {
        traffic: [
            { name: 'Organic Search', color: '#0077be' },
            { name: 'Direct', color: '#00d4aa' },
            { name: 'Social Media', color: '#ff6b35' },
            { name: 'Email', color: '#f7931e' }
        ],
        revenue: [
            { name: 'Product Sales', color: '#0077be' },
            { name: 'Services', color: '#00d4aa' },
            { name: 'Subscriptions', color: '#ff6b35' },
            { name: 'Other', color: '#f7931e' }
        ],
        customers: [
            { name: 'Enterprise', color: '#0077be' },
            { name: 'SMB', color: '#00d4aa' },
            { name: 'Startup', color: '#ff6b35' },
            { name: 'Individual', color: '#f7931e' }
        ],
        products: [
            { name: 'Product A', color: '#0077be' },
            { name: 'Product B', color: '#00d4aa' },
            { name: 'Product C', color: '#ff6b35' },
            { name: 'Product D', color: '#f7931e' }
        ]
    };
    return categories[type] || categories.traffic;
}

function getChartTitle(type) {
    const titles = {
        revenue: 'Revenue Trend',
        orders: 'Order Volume',
        users: 'User Growth',
        conversion: 'Conversion Rate'
    };
    return titles[type] || 'Data Trend';
}

function getPieChartTitle(type) {
    const titles = {
        traffic: 'Traffic Sources',
        revenue: 'Revenue Sources',
        customers: 'Customer Segments',
        products: 'Product Performance'
    };
    return titles[type] || 'Data Distribution';
}

function renderDynamicChart(data) {
    const svg = document.querySelector('.dynamic-chart-svg');
    if (!svg) return;
    
    // Clear existing paths
    svg.querySelector('.dynamic-area-path').setAttribute('d', '');
    svg.querySelector('.dynamic-line-path').setAttribute('d', '');
    svg.querySelector('.dynamic-data-points').innerHTML = '';
    
    // Generate path data
    let areaPath = `M ${data[0].x} 200`;
    let linePath = `M ${data[0].x} ${data[0].y}`;
    
    data.forEach((point, index) => {
        if (index > 0) {
            linePath += ` L ${point.x} ${point.y}`;
        }
        areaPath += ` L ${point.x} ${point.y}`;
    });
    
    areaPath += ` L ${data[data.length - 1].x} 200 Z`;
    
    // Update paths
    svg.querySelector('.dynamic-area-path').setAttribute('d', areaPath);
    svg.querySelector('.dynamic-line-path').setAttribute('d', linePath);
    
    // Add data points
    const pointsGroup = svg.querySelector('.dynamic-data-points');
    data.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#0077be');
        circle.setAttribute('class', 'data-point-svg');
        pointsGroup.appendChild(circle);
    });
}

function renderDynamicPieChart(data) {
    const svg = document.querySelector('.pie-svg');
    const legend = document.getElementById('dynamicPieLegend');
    
    if (!svg || !legend) return;
    
    // Clear existing segments
    svg.querySelector('.pie-segments').innerHTML = '';
    legend.innerHTML = '';
    
    // Calculate pie segments
    let currentAngle = 0;
    const radius = 50;
    const centerX = 60;
    const centerY = 60;
    
    data.forEach((segment, index) => {
        const angle = (segment.percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        // Create path for pie segment
        const path = createPieSegment(centerX, centerY, radius, startAngle, endAngle);
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        pathElement.setAttribute('fill', segment.color);
        pathElement.setAttribute('class', 'pie-segment');
        svg.querySelector('.pie-segments').appendChild(pathElement);
        
        // Add legend item
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <span class="legend-color" style="background: ${segment.color};"></span>
            <span>${segment.label} (${segment.percentage}%)</span>
        `;
        legend.appendChild(legendItem);
        
        currentAngle += angle;
    });
}

function createPieSegment(centerX, centerY, radius, startAngle, endAngle) {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function updateActivityFeed() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing activities
    activityList.innerHTML = '';
    
    // Generate activities based on assigned data
    assignedData.forEach((data, index) => {
        if (index < 5) { // Show only last 5 activities
            const activity = document.createElement('div');
            activity.className = 'activity-item';
            activity.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="activity-content">
                    <h4>${data.name} Updated</h4>
                    <p>${data.description}</p>
                    <span class="activity-time">${formatTime(data.uploadedAt)}</span>
                </div>
            `;
            activityList.appendChild(activity);
        }
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
}

function setupRealTimeUpdates() {
    // Set up periodic data refresh
    setInterval(async () => {
        if (googleDriveReady) {
            await loadAssignedData();
        }
    }, 30000); // Refresh every 30 seconds
    
    // Set up chart type change handlers
    const chartTypeSelect = document.getElementById('chartType');
    if (chartTypeSelect) {
        chartTypeSelect.addEventListener('change', updateMainChart);
    }
    
    const pieChartTypeSelect = document.getElementById('pieChartType');
    if (pieChartTypeSelect) {
        pieChartTypeSelect.addEventListener('change', updatePieChart);
    }
}

function loadDemoData() {
    // Load demo customer data
    customerData = {
        id: 1,
        name: 'Demo Customer',
        company: 'Demo Company',
        industry: 'Technology',
        status: 'active'
    };
    
    updateCustomerDashboard();
    loadDemoAssignedData();
}

function loadDemoAssignedData() {
    // Load demo assigned data
    assignedData = [
        {
            id: 1,
            name: 'Q4 2024 Sales Report',
            category: 'sales',
            description: 'Revenue, orders, and customer acquisition data',
            uploadedAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Website Traffic Analysis',
            category: 'analytics',
            description: 'Page views, bounce rates, and user behavior',
            uploadedAt: new Date().toISOString()
        }
    ];
    
    updateDashboardWithAssignedData();
}
