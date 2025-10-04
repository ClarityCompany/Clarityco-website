// Admin Panel JavaScript with Google Drive Integration

// Global variables
let customers = [];
let currentEditingCustomer = null;
let dashboardData = [];
let currentDataCategory = 'sales';
let googleDriveReady = false;

// Check if admin is logged in
document.addEventListener('DOMContentLoaded', async function() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Set admin username
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        document.getElementById('adminUserName').textContent = adminUser;
    }
    
    // Initialize Google Drive integration
    await initializeGoogleDrive();
    
    // Initialize navigation
    initializeNavigation();
    
    // Load initial data
    await loadCustomerData();
    await loadDashboardDataFromDrive();
    
    // Initialize assignment radio buttons
    initializeAssignmentRadioButtons();
    
    // Setup form handlers
    setupAddCustomerForm();
    setupEditCustomerForm();
    
    // Add debug info
    console.log('Admin panel initialized');
    console.log('Google Drive ready:', googleDriveReady);
    console.log('Customers loaded:', customers.length);
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-menu .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            const sections = document.querySelectorAll('.admin-section');
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

// Google Drive Integration
function initializeGoogleDrive() {
    // Load Google Drive API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = function() {
        gapi.load('client:auth2', initClient);
    };
    document.head.appendChild(script);
}

function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY', // You'll need to get this from Google Cloud Console
        clientId: 'YOUR_CLIENT_ID', // You'll need to get this from Google Cloud Console
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file'
    }).then(() => {
        console.log('Google Drive API initialized');
        // Auto-load customer data from Google Drive
        loadCustomerDataFromDrive();
    });
}

// Customer management functions
function loadCustomerData() {
    // Try to load from Google Drive first, fallback to localStorage
    const driveData = localStorage.getItem('customersFromDrive');
    if (driveData) {
        customers = JSON.parse(driveData);
        renderCustomers();
    } else {
        // Load default customers
        customers = [
            {
                id: 1,
                name: 'Acme Corporation',
                contact: 'John Smith',
                title: 'CEO',
                email: 'john@acme.com',
                phone: '(555) 123-4567',
                plan: 'professional',
                industry: 'Technology',
                username: 'acme_user',
                password: 'acme2024',
                status: 'active',
                notes: 'Long-term client, very satisfied with services',
                lastLogin: '2 days ago',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'TechStart Inc',
                contact: 'Sarah Johnson',
                title: 'CTO',
                email: 'sarah@techstart.com',
                phone: '(555) 987-6543',
                plan: 'enterprise',
                industry: 'Software',
                username: 'techstart_user',
                password: 'tech2024',
                status: 'active',
                notes: 'Fast-growing startup, needs regular analytics updates',
                lastLogin: '1 week ago',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Local Business Co',
                contact: 'Mike Davis',
                title: 'Owner',
                email: 'mike@localbiz.com',
                phone: '(555) 456-7890',
                plan: 'starter',
                industry: 'Retail',
                username: 'localbiz_user',
                password: 'local2024',
                status: 'inactive',
                notes: 'Seasonal business, may reactivate next quarter',
                lastLogin: '3 weeks ago',
                createdAt: new Date().toISOString()
            }
        ];
        renderCustomers();
        saveCustomerDataToDrive();
    }
}

function loadCustomerDataFromDrive() {
    // This would load data from Google Drive
    // For now, we'll use localStorage as a fallback
    console.log('Loading customer data from Google Drive...');
}

function saveCustomerDataToDrive() {
    // Save to localStorage as backup
    localStorage.setItem('customersFromDrive', JSON.stringify(customers));
    
    // In a real implementation, this would save to Google Drive
    console.log('Saving customer data to Google Drive...');
}

function renderCustomers() {
    const customersGrid = document.querySelector('.customers-grid');
    customersGrid.innerHTML = '';
    
    customers.forEach(customer => {
        const customerCard = createCustomerCard(customer);
        customersGrid.appendChild(customerCard);
    });
}

function createCustomerCard(customer) {
    const card = document.createElement('div');
    card.className = 'customer-card';
    card.innerHTML = `
        <div class="customer-header">
            <h3>${customer.name}</h3>
            <span class="customer-status ${customer.status}">${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
        </div>
        <div class="customer-info">
            <p><strong>Contact:</strong> ${customer.contact} (${customer.title})</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
            <p><strong>Plan:</strong> ${customer.plan.charAt(0).toUpperCase() + customer.plan.slice(1)}</p>
            <p><strong>Industry:</strong> ${customer.industry || 'Not specified'}</p>
            <p><strong>Last Login:</strong> ${customer.lastLogin}</p>
        </div>
        <div class="customer-actions">
            <button class="btn btn-outline" onclick="editCustomer(${customer.id})">Edit</button>
            <button class="btn btn-primary" onclick="viewDashboard(${customer.id})">View Dashboard</button>
        </div>
    `;
    return card;
}

function showAddCustomerModal() {
    document.getElementById('addCustomerModal').style.display = 'block';
}

function closeAddCustomerModal() {
    document.getElementById('addCustomerModal').style.display = 'none';
    document.getElementById('addCustomerForm').reset();
}

// Add customer form submission
document.getElementById('addCustomerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(), // Generate unique ID
        name: document.getElementById('customerName').value,
        contact: document.getElementById('contactName').value,
        title: document.getElementById('contactTitle').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        plan: document.getElementById('customerPlan').value,
        industry: document.getElementById('customerIndustry').value,
        username: document.getElementById('customerUsername').value,
        password: document.getElementById('customerPassword').value,
        status: document.getElementById('customerStatus').value,
        notes: document.getElementById('customerNotes').value,
        lastLogin: 'Never',
        createdAt: new Date().toISOString()
    };
    
    // Add customer to array
    customers.push(formData);
    
    // Save to Google Drive and localStorage
    saveCustomerDataToDrive();
    
    // Re-render customers
    renderCustomers();
    
    // Close modal and reset form
    closeAddCustomerModal();
    
    // Show success message
    showNotification('Customer added successfully!', 'success');
});

// Edit customer form submission
document.getElementById('editCustomerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('editCustomerId').value);
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex !== -1) {
        // Update customer data
        customers[customerIndex] = {
            ...customers[customerIndex],
            name: document.getElementById('editCustomerName').value,
            contact: document.getElementById('editContactName').value,
            title: document.getElementById('editContactTitle').value,
            email: document.getElementById('editContactEmail').value,
            phone: document.getElementById('editContactPhone').value,
            plan: document.getElementById('editCustomerPlan').value,
            industry: document.getElementById('editCustomerIndustry').value,
            username: document.getElementById('editCustomerUsername').value,
            status: document.getElementById('editCustomerStatus').value,
            notes: document.getElementById('editCustomerNotes').value,
            updatedAt: new Date().toISOString()
        };
        
        // Update password if provided
        const newPassword = document.getElementById('editCustomerPassword').value;
        if (newPassword) {
            customers[customerIndex].password = newPassword;
        }
        
        // Save to Google Drive and localStorage
        saveCustomerDataToDrive();
        
        // Re-render customers
        renderCustomers();
        
        // Close modal
        closeEditCustomerModal();
        
        // Show success message
        showNotification('Customer updated successfully!', 'success');
    }
});

function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        currentEditingCustomer = customer;
        
        // Populate edit form
        document.getElementById('editCustomerId').value = customer.id;
        document.getElementById('editCustomerName').value = customer.name;
        document.getElementById('editContactName').value = customer.contact;
        document.getElementById('editContactTitle').value = customer.title || '';
        document.getElementById('editContactEmail').value = customer.email;
        document.getElementById('editContactPhone').value = customer.phone || '';
        document.getElementById('editCustomerPlan').value = customer.plan;
        document.getElementById('editCustomerIndustry').value = customer.industry || '';
        document.getElementById('editCustomerUsername').value = customer.username;
        document.getElementById('editCustomerStatus').value = customer.status;
        document.getElementById('editCustomerNotes').value = customer.notes || '';
        document.getElementById('editCustomerPassword').value = '';
        
        // Show edit modal
        document.getElementById('editCustomerModal').style.display = 'block';
    }
}

function deleteCustomer() {
    if (currentEditingCustomer && confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        const customerIndex = customers.findIndex(c => c.id === currentEditingCustomer.id);
        if (customerIndex !== -1) {
            customers.splice(customerIndex, 1);
            saveCustomerDataToDrive();
            renderCustomers();
            closeEditCustomerModal();
            showNotification('Customer deleted successfully!', 'success');
        }
    }
}

function closeEditCustomerModal() {
    document.getElementById('editCustomerModal').style.display = 'none';
    document.getElementById('editCustomerForm').reset();
    currentEditingCustomer = null;
}

function viewDashboard(customerId) {
    // In a real application, this would open the customer's dashboard
    showNotification('Customer dashboard would open here', 'info');
}

// Data Management Functions
function showDataCategory(category) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update data categories
    document.querySelectorAll('.data-category').forEach(cat => cat.classList.remove('active'));
    document.getElementById(category + '-data').classList.add('active');
    
    currentDataCategory = category;
}

function showUploadDataModal() {
    document.getElementById('uploadDataModal').style.display = 'block';
    populateCustomerCheckboxes();
    setupFileUpload();
}

function closeUploadDataModal() {
    document.getElementById('uploadDataModal').style.display = 'none';
    document.getElementById('uploadDataForm').reset();
}

function setupFileUpload() {
    const fileInput = document.getElementById('dataFile');
    const uploadArea = document.getElementById('fileUploadArea');
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFileDisplay(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            updateFileDisplay(e.target.files[0]);
        }
    });
}

function updateFileDisplay(file) {
    const placeholder = document.querySelector('.upload-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-file"></i>
        <p>${file.name}</p>
        <span class="file-types">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
    `;
}

function populateCustomerCheckboxes() {
    const container = document.querySelector('#customerSelection .customer-checkboxes');
    container.innerHTML = '';
    
    customers.forEach(customer => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${customer.id}">
            ${customer.name}
        `;
        container.appendChild(label);
    });
}

// Upload data form submission
document.getElementById('uploadDataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        name: document.getElementById('dataName').value,
        category: document.getElementById('dataCategory').value,
        type: document.getElementById('dataType').value,
        description: document.getElementById('dataDescription').value,
        file: document.getElementById('dataFile').files[0],
        assignedCustomers: getSelectedCustomers(),
        uploadedAt: new Date().toISOString()
    };
    
    // Add to dashboard data
    dashboardData.push(formData);
    
    // Save to Google Drive
    saveDashboardDataToDrive();
    
    // Show success message
    showNotification('Data uploaded and assigned successfully!', 'success');
    
    // Close modal
    closeUploadDataModal();
    
    // Refresh data display
    refreshDataDisplay();
});

function getSelectedCustomers() {
    const assignment = document.querySelector('input[name="assignment"]:checked').value;
    
    if (assignment === 'all') {
        return customers.filter(c => c.status === 'active').map(c => c.id);
    } else {
        const checkboxes = document.querySelectorAll('#customerSelection input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => parseInt(cb.value));
    }
}

function assignDataToCustomers(category) {
    showNotification('Data assignment modal would open here', 'info');
}

function manageAssignments(category, dataId) {
    document.getElementById('dataAssignmentModal').style.display = 'block';
    populateAssignmentModal(dataId);
}

function closeDataAssignmentModal() {
    document.getElementById('dataAssignmentModal').style.display = 'none';
}

function populateAssignmentModal(dataId) {
    // This would populate the assignment modal with actual data
    // For now, we'll show a demo
    const assignedCustomers = document.getElementById('assignedCustomers');
    const availableCustomers = document.getElementById('availableCustomers');
    
    // Show assigned customers
    assignedCustomers.innerHTML = `
        <div class="assigned-customer">
            <span class="customer-name">Acme Corporation</span>
            <button class="remove-assignment" onclick="removeAssignment(1)">Remove</button>
        </div>
        <div class="assigned-customer">
            <span class="customer-name">TechStart Inc</span>
            <button class="remove-assignment" onclick="removeAssignment(2)">Remove</button>
        </div>
    `;
    
    // Show available customers
    availableCustomers.innerHTML = `
        <label><input type="checkbox" value="3"> Local Business Co</label>
        <label><input type="checkbox" value="4"> New Customer</label>
    `;
}

function removeAssignment(customerId) {
    showNotification('Assignment removed successfully!', 'success');
}

function saveDataAssignments() {
    showNotification('Data assignments saved successfully!', 'success');
    closeDataAssignmentModal();
}

function exportData(category) {
    showNotification(`Exporting ${category} data...`, 'info');
}

function refreshDataDisplay() {
    // This would refresh the data display with new uploads
    console.log('Refreshing data display...');
}

function saveDashboardDataToDrive() {
    // Save to localStorage as backup
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    
    // In a real implementation, this would save to Google Drive
    console.log('Saving dashboard data to Google Drive...');
}

function loadDashboardDataFromDrive() {
    // Load from localStorage
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
        dashboardData = JSON.parse(savedData);
    }
    
    // In a real implementation, this would load from Google Drive
    console.log('Loading dashboard data from Google Drive...');
}

function initializeAssignmentRadioButtons() {
    // Handle assignment radio button changes
    document.addEventListener('change', function(e) {
        if (e.target.name === 'assignment') {
            const customerSelection = document.getElementById('customerSelection');
            if (e.target.value === 'select') {
                customerSelection.style.display = 'block';
            } else {
                customerSelection.style.display = 'none';
            }
        }
    });
}

// Google Drive Integration Functions
async function initializeGoogleDrive() {
    try {
        // Check if Google Drive is enabled in config
        if (!window.CONFIG?.ENABLE_GOOGLE_DRIVE) {
            console.log('Google Drive disabled in config. Using localStorage only.');
            googleDriveReady = false;
            return;
        }
        
        if (window.googleDriveManager) {
            // Check if API keys are configured
            if (window.CONFIG?.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' || 
                window.CONFIG?.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                throw new Error('Google API credentials not configured');
            }
            
            await window.googleDriveManager.initialize();
            googleDriveReady = true;
            console.log('Google Drive integration ready');
            
            // Show Google Drive status
            showNotification('Google Drive connected successfully!', 'success');
        } else {
            console.warn('Google Drive manager not available');
            showNotification('Google Drive integration not available. Using local storage.', 'warning');
        }
    } catch (error) {
        console.error('Error initializing Google Drive:', error);
        
        // Provide specific error messages
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
        if (errorMessage.includes('credentials not configured')) {
            showNotification('Google API credentials not configured. Using local storage.', 'warning');
        } else if (errorMessage.includes('API key')) {
            showNotification('Google API key error. Please check your configuration.', 'error');
        } else if (errorMessage.includes('Drive API')) {
            showNotification('Google Drive API not enabled. Please enable it in Google Cloud Console.', 'error');
        } else if (errorMessage.includes('Content Security Policy') || errorMessage.includes('CSP')) {
            showNotification('Google Drive blocked by security policy. Using local storage.', 'warning');
        } else {
            showNotification('Failed to connect to Google Drive. Using local storage.', 'warning');
        }
        
        googleDriveReady = false;
    }
}

async function loadCustomerData() {
    try {
        if (googleDriveReady && window.googleDriveManager) {
            // Load from Google Drive
            customers = await window.googleDriveManager.loadCustomerData();
            console.log('Loaded customers from Google Drive:', customers.length);
        } else {
            // Fallback to localStorage
            const savedCustomers = localStorage.getItem('customers');
            customers = savedCustomers ? JSON.parse(savedCustomers) : [];
            console.log('Loaded customers from localStorage:', customers.length);
        }
        
        // If no customers exist, create some demo data
        if (customers.length === 0) {
            customers = [
                {
                    id: 1,
                    name: 'Acme Corporation',
                    email: 'contact@acme.com',
                    company: 'Acme Corp',
                    phone: '555-123-4567',
                    username: 'acme_user',
                    password: 'acme2024',
                    industry: 'Manufacturing',
                    status: 'active',
                    notes: 'Large manufacturing company with complex data needs',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'TechStart Inc',
                    email: 'info@techstart.com',
                    company: 'TechStart Inc',
                    phone: '555-987-6543',
                    username: 'techstart_user',
                    password: 'tech2024',
                    industry: 'Technology',
                    status: 'active',
                    notes: 'Startup company looking for growth insights',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Local Business Co',
                    email: 'owner@localbiz.com',
                    company: 'Local Business Co',
                    phone: '555-456-7890',
                    username: 'localbiz_user',
                    password: 'local2024',
                    industry: 'Retail',
                    status: 'active',
                    notes: 'Small local business expanding operations',
                    createdAt: new Date().toISOString()
                }
            ];
            
            // Save the demo data to Google Drive
            await saveCustomerDataToDrive();
            console.log('Created and saved demo customers to Google Drive');
        }
        
        renderCustomers();
    } catch (error) {
        console.error('Error loading customer data:', error);
        showNotification('Error loading customer data', 'error');
    }
}

async function saveCustomerDataToDrive() {
    try {
        if (googleDriveReady && window.googleDriveManager) {
            await window.googleDriveManager.saveCustomerData(customers);
            console.log('Saved customers to Google Drive');
        } else {
            // Fallback to localStorage
            localStorage.setItem('customers', JSON.stringify(customers));
            console.log('Saved customers to localStorage');
        }
    } catch (error) {
        console.error('Error saving customer data:', error);
        // Fallback to localStorage
        localStorage.setItem('customers', JSON.stringify(customers));
        showNotification('Error saving to Google Drive. Data saved locally.', 'warning');
    }
}

async function loadDashboardDataFromDrive() {
    try {
        if (googleDriveReady && window.googleDriveManager) {
            dashboardData = await window.googleDriveManager.loadDashboardData();
            console.log('Loaded dashboard data from Google Drive:', dashboardData.length);
        } else {
            // Fallback to localStorage
            const savedData = localStorage.getItem('dashboardData');
            dashboardData = savedData ? JSON.parse(savedData) : [];
            console.log('Loaded dashboard data from localStorage:', dashboardData.length);
        }
        
        // If no dashboard data exists, create some demo data
        if (dashboardData.length === 0) {
            dashboardData = [
                {
                    id: 1,
                    name: 'Q4 2024 Sales Report',
                    category: 'sales',
                    type: 'csv',
                    description: 'Revenue, orders, and customer acquisition data',
                    assignedCustomers: [1, 2],
                    uploadedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Website Traffic Analysis',
                    category: 'analytics',
                    type: 'csv',
                    description: 'Page views, bounce rates, and user behavior',
                    assignedCustomers: [1, 2, 3],
                    uploadedAt: new Date().toISOString()
                }
            ];
            
            // Save the demo data
            await saveDashboardDataToDrive();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

async function saveDashboardDataToDrive() {
    try {
        if (googleDriveReady && window.googleDriveManager) {
            await window.googleDriveManager.saveDashboardData(dashboardData);
            console.log('Saved dashboard data to Google Drive');
        } else {
            // Fallback to localStorage
            localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
            console.log('Saved dashboard data to localStorage');
        }
    } catch (error) {
        console.error('Error saving dashboard data:', error);
        // Fallback to localStorage
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        showNotification('Error saving to Google Drive. Data saved locally.', 'warning');
    }
}

// Add customer form submission (only add once)
function setupAddCustomerForm() {
    const form = document.getElementById('addCustomerForm');
    if (form && !form.hasAttribute('data-listener-added')) {
        form.setAttribute('data-listener-added', 'true');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('Add customer form submitted');
            
            const formData = {
                id: Date.now(),
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                company: document.getElementById('customerCompany').value,
                phone: document.getElementById('customerPhone').value,
                username: document.getElementById('customerUsername').value,
                password: document.getElementById('customerPassword').value,
                industry: document.getElementById('customerIndustry').value,
                status: document.getElementById('customerStatus').value,
                notes: document.getElementById('customerNotes').value,
                createdAt: new Date().toISOString()
            };
            
            console.log('Form data:', formData);
            
            customers.push(formData);
            console.log('Added to customers array. Total customers:', customers.length);
            
            // Save to both localStorage and Google Drive
            try {
                // Always save to localStorage first
                localStorage.setItem('customers', JSON.stringify(customers));
                console.log('Saved to localStorage successfully');
                
                // Try to save to Google Drive
                if (googleDriveReady) {
                    await saveCustomerDataToDrive();
                    console.log('Saved to Google Drive successfully');
                    showNotification('Customer added and saved to Google Drive!', 'success');
                } else {
                    console.log('Google Drive not ready, saved to localStorage only');
                    showNotification('Customer added and saved locally!', 'success');
                }
            } catch (error) {
                console.error('Error saving customer:', error);
                showNotification('Customer added but save failed: ' + error.message, 'error');
            }
            
            // Close modal
            closeAddCustomerModal();
            
            // Refresh customer list
            renderCustomers();
        });
    }
}

// Edit customer form submission (only add once)
function setupEditCustomerForm() {
    const form = document.getElementById('editCustomerForm');
    if (form && !form.hasAttribute('data-listener-added')) {
        form.setAttribute('data-listener-added', 'true');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('Edit customer form submitted');
            
            const customerId = parseInt(document.getElementById('editCustomerId').value);
            const customerIndex = customers.findIndex(c => c.id === customerId);
            
            console.log('Editing customer ID:', customerId, 'Index:', customerIndex);
            
            if (customerIndex !== -1) {
                customers[customerIndex] = {
                    ...customers[customerIndex],
                    name: document.getElementById('editCustomerName').value,
                    email: document.getElementById('editCustomerEmail').value,
                    company: document.getElementById('editCustomerCompany').value,
                    phone: document.getElementById('editCustomerPhone').value,
                    username: document.getElementById('editCustomerUsername').value,
                    password: document.getElementById('editCustomerPassword').value,
                    industry: document.getElementById('editCustomerIndustry').value,
                    status: document.getElementById('editCustomerStatus').value,
                    notes: document.getElementById('editCustomerNotes').value
                };
                
                console.log('Updated customer:', customers[customerIndex]);
                
                // Save to both localStorage and Google Drive
                try {
                    // Always save to localStorage first
                    localStorage.setItem('customers', JSON.stringify(customers));
                    console.log('Updated in localStorage successfully');
                    
                    // Try to save to Google Drive
                    if (googleDriveReady) {
                        await saveCustomerDataToDrive();
                        console.log('Updated in Google Drive successfully');
                        showNotification('Customer updated and saved to Google Drive!', 'success');
                    } else {
                        console.log('Google Drive not ready, updated in localStorage only');
                        showNotification('Customer updated and saved locally!', 'success');
                    }
                } catch (error) {
                    console.error('Error updating customer:', error);
                    showNotification('Customer updated but save failed: ' + error.message, 'error');
                }
                
                // Close modal
                closeEditCustomerModal();
                
                // Refresh customer list
                renderCustomers();
            } else {
                console.error('Customer not found for editing');
                showNotification('Error: Customer not found', 'error');
            }
        });
    }
}

// Update the upload data form submission to use Google Drive
document.getElementById('uploadDataForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        name: document.getElementById('dataName').value,
        category: document.getElementById('dataCategory').value,
        type: document.getElementById('dataType').value,
        description: document.getElementById('dataDescription').value,
        file: document.getElementById('dataFile').files[0], // In a real app, this would be uploaded
        assignedCustomers: getSelectedCustomers(),
        uploadedAt: new Date().toISOString()
    };
    
    // Add to dashboard data
    dashboardData.push(formData);
    
    // Save to Google Drive
    await saveDashboardDataToDrive();
    
    // Show success message
    showNotification('Data uploaded and assigned successfully!', 'success');
    
    // Close modal
    closeUploadDataModal();
    
    // Refresh data display
    refreshDataDisplay();
});

function createNewDashboard() {
    showNotification('Dashboard creation wizard would open here', 'info');
}

function uploadData() {
    showNotification('Data upload interface would open here', 'info');
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    window.location.href = 'admin-login.html';
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addCustomerModal');
    if (event.target === modal) {
        closeAddCustomerModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAddCustomerModal();
    }
});
