// dashboard.js - Unified Finance Dashboard Controller

import { CalculatorController } from '../../controllers/calculator.js';
import { ScenarioService } from '../../services/storage.js';
import { StorageService } from '../../services/storage.js';
import { AlertService } from '../../services/alert-service.js';
import { ApprovalService } from '../../services/approval-service.js';
import { RoleService } from '../../services/role-service.js';
// Chart rendering using Chart.js directly
const ChartRenderer = {
    renderLineChart(ctx, config) {
        return new Chart(ctx, {
            type: 'line',
            data: config,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    },
    
    renderBarChart(ctx, config) {
        return new Chart(ctx, {
            type: 'bar',
            data: config,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
};
import { PortfolioService } from '../../services/portfolio.js';

/**
 * Main Dashboard Controller
 * Orchestrates all UI components and role-based access control
 */
class Dashboard {
    constructor() {
        this.currentRole = 'viewer';
        this.currentUser = null;
        this.activePanel = 'dashboard';
        this.charts = {};
        this.isInitialized = false;
    }

    /**
     * Initialize dashboard with all components
     */
    async initDashboard() {
        if (this.isInitialized) return;
        
        try {
            // Initialize services
            await this.initializeServices();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Render initial UI based on role
            this.currentRole = RoleService.getCurrentRole();
            this.currentUser = RoleService.getCurrentUser();
            
            this.renderRoleAccess(this.currentRole);
            this.renderAllPanels();
            
            // Start background updates
            this.startBackgroundUpdates();
            
            this.isInitialized = true;
            console.log('Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Dashboard initialization failed. Please refresh.');
        }
    }

    /**
     * Initialize all required services
     */
    async initializeServices() {
        // Load initial data
        await Promise.all([
            StorageService.load(),
            PortfolioService.load(),
            AlertService.load()
        ]);
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const panel = e.currentTarget.dataset.panel;
                this.showPanel(panel);
            });
        });

        // Role switch (for demo)
        const roleSelect = document.createElement('select');
        roleSelect.innerHTML = `
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
        `;
        roleSelect.value = this.currentRole;
        roleSelect.addEventListener('change', (e) => {
            this.switchRole(e.target.value);
        });
        
        // Add role selector to header for demo purposes
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            const roleContainer = document.createElement('div');
            roleContainer.className = 'role-selector';
            roleContainer.appendChild(roleSelect);
            userInfo.insertBefore(roleContainer, userInfo.firstChild);
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Panel-specific buttons
        this.setupPanelEventListeners();
    }

    /**
     * Set up panel-specific event listeners
     */
    setupPanelEventListeners() {
        // Dashboard buttons
        const viewAllBtn = document.getElementById('view-all-scenarios');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.showPanel('scenarios'));
        }

        const refreshChartBtn = document.getElementById('refresh-chart');
        if (refreshChartBtn) {
            refreshChartBtn.addEventListener('click', () => this.renderCharts());
        }

        // Calculator buttons
        const calcNewScenarioBtn = document.getElementById('calc-new-scenario');
        if (calcNewScenarioBtn) {
            calcNewScenarioBtn.addEventListener('click', () => this.createNewScenario());
        }

        const calcImportExcelBtn = document.getElementById('calc-import-excel');
        if (calcImportExcelBtn) {
            calcImportExcelBtn.addEventListener('click', () => this.importExcelData());
        }

        // Admin buttons
        const unlockFormulasBtn = document.getElementById('unlock-formulas');
        if (unlockFormulasBtn) {
            unlockFormulasBtn.addEventListener('click', () => this.toggleFormulaLock());
        }

        const overrideAlertsCheckbox = document.getElementById('override-alerts');
        if (overrideAlertsCheckbox) {
            overrideAlertsCheckbox.addEventListener('change', (e) => {
                this.toggleAlertOverride(e.target.checked);
            });
        }
    }

    /**
     * Render UI based on user role
     * @param {string} role - Current user role
     */
    renderRoleAccess(role) {
        this.currentRole = role;
        
        // Update role badge
        const roleBadge = document.getElementById('role-badge');
        if (roleBadge) {
            roleBadge.className = 'role-badge ' + role;
            roleBadge.querySelector('.role-name').textContent = role.toUpperCase();
        }

        // Update username
        const usernameSpan = document.getElementById('username');
        if (usernameSpan && this.currentUser) {
            usernameSpan.textContent = this.currentUser.name;
        }

        // Apply role-based visibility rules
        this.applyRoleRules();
        
        // Update status
        this.updateStatus(`Role set to ${role}`);
    }

    /**
     * Apply role-based rules to all UI elements
     */
    applyRoleRules() {
        const isViewer = this.currentRole === 'viewer';
        const isAnalyst = this.currentRole === 'analyst';
        const isAdmin = this.currentRole === 'admin';

        // Show/hide admin-only elements
        document.querySelectorAll('.admin-only').forEach(el => {
            requireRole(['admin'], el.id || '', isAdmin);
        });

        // Show/hide analyst-only elements
        document.querySelectorAll('.analyst-only').forEach(el => {
            requireRole(['analyst', 'admin'], el.id || '', isAnalyst || isAdmin);
        });

        // Disable inputs for viewers
        if (isViewer) {
            document.querySelectorAll('input, select, textarea, button:not(#logout-btn)').forEach(el => {
                if (!el.classList.contains('role-selector')) {
                    el.classList.add('viewer-disabled');
                }
            });
        } else {
            document.querySelectorAll('.viewer-disabled').forEach(el => {
                el.classList.remove('viewer-disabled');
            });
        }

        // Specific button visibility
        const adminButtons = ['unlock-formulas', 'save-alert-settings', 'system-health'];
        adminButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) requireRole(['admin'], id, isAdmin);
        });

        const analystButtons = ['calc-new-scenario', 'scenario-create', 'generate-report'];
        analystButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) requireRole(['analyst', 'admin'], id, isAnalyst || isAdmin);
        });
    }

    /**
     * Show specific panel
     * @param {string} panelName - Name of panel to show
     */
    showPanel(panelName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.panel === panelName) {
                item.classList.add('active');
            }
        });

        // Update content panels
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(`${panelName}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            
            // Update current view name
            const viewNameSpan = document.getElementById('current-view-name');
            if (viewNameSpan) {
                viewNameSpan.textContent = panelName.charAt(0).toUpperCase() + panelName.slice(1);
            }

            // Load panel-specific content
            this.loadPanelContent(panelName);
            
            this.activePanel = panelName;
        }
    }

    /**
     * Load content for specific panel
     * @param {string} panelName - Panel name
     */
    async loadPanelContent(panelName) {
        switch (panelName) {
            case 'dashboard':
                await this.renderKPIs();
                await this.renderCharts();
                await this.renderScenarioTable();
                break;
                
            case 'calculator':
                await this.renderCalculator();
                break;
                
            case 'scenarios':
                await this.renderScenariosList();
                break;
                
            case 'portfolio':
                await this.renderPortfolio();
                break;
                
            case 'audit':
                await this.renderAuditTrail();
                break;
                
            case 'alerts':
                await this.renderAlerts();
                break;
                
            case 'reports':
                await this.renderReports();
                break;
                
            case 'admin':
                await this.renderAdminPanel();
                break;
        }
    }

    /**
     * Render all panels (initial load)
     */
    async renderAllPanels() {
        await this.renderKPIs();
        await this.renderCharts();
        await this.renderScenarioTable();
        await this.renderAlerts();
    }

    /**
     * Render KPI cards with current data
     */
    async renderKPIs() {
        try {
            // Get data from services
            const totals = await PortfolioService.getTotals();
            const pendingApprovals = await ApprovalService.getPendingCount();
            
            // Update KPI values
            document.getElementById('kpi-ebitda').textContent = 
                `$${totals.ebitda?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`;
            
            document.getElementById('kpi-margin').textContent = 
                `${totals.margin?.toFixed(1) || '0.0'}%`;
            
            document.getElementById('kpi-properties').textContent = 
                totals.properties || '0';
            
            document.getElementById('kpi-pending').textContent = 
                pendingApprovals || '0';
                
        } catch (error) {
            console.error('Failed to render KPIs:', error);
        }
    }

    /**
     * Render charts with current data
     */
    async renderCharts() {
        try {
            // Destroy existing charts
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.destroy) chart.destroy();
            });
            this.charts = {};

            // Get chart data
            const trendData = await PortfolioService.getTrendData();
            const propertyData = await PortfolioService.getPropertyPerformance();

            // Render trend chart
            const trendCtx = document.getElementById('ebitda-trend-chart');
            if (trendCtx) {
                this.charts.trend = ChartRenderer.renderLineChart(trendCtx, {
                    labels: trendData.labels,
                    datasets: [{
                        label: 'EBITDA',
                        data: trendData.values,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true
                    }]
                });
            }

            // Render property chart
            const propertyCtx = document.getElementById('property-chart');
            if (propertyCtx && propertyData) {
                this.charts.property = ChartRenderer.renderBarChart(propertyCtx, {
                    labels: propertyData.labels,
                    datasets: [{
                        label: 'EBITDA by Property',
                        data: propertyData.values,
                        backgroundColor: 'rgba(46, 204, 113, 0.6)',
                        borderColor: 'rgba(46, 204, 113, 1)'
                    }]
                });
            }
            
        } catch (error) {
            console.error('Failed to render charts:', error);
        }
    }

    /**
     * Render recent scenarios table
     */
    async renderScenarioTable() {
        try {
            const scenarios = await ScenarioService.getRecentScenarios(10);
            const tbody = document.getElementById('scenarios-table-body');
            
            if (!tbody) return;
            
            tbody.innerHTML = scenarios.map(scenario => `
                <tr>
                    <td>${scenario.name}</td>
                    <td>${scenario.property || 'N/A'}</td>
                    <td>
                        <span class="scenario-type ${scenario.type?.toLowerCase()}">
                            ${scenario.type || 'Unknown'}
                        </span>
                    </td>
                    <td>$${scenario.ebitda?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</td>
                    <td>${scenario.margin?.toFixed(1) || '0.0'}%</td>
                    <td>
                        <span class="status-badge ${scenario.status?.toLowerCase()}">
                            ${scenario.status || 'Draft'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-action view-scenario" data-id="${scenario.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${this.currentRole !== 'viewer' ? `
                            <button class="btn-action edit-scenario" data-id="${scenario.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');

            // Add event listeners to action buttons
            tbody.querySelectorAll('.view-scenario').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const scenarioId = e.currentTarget.dataset.id;
                    this.viewScenario(scenarioId);
                });
            });

            tbody.querySelectorAll('.edit-scenario').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const scenarioId = e.currentTarget.dataset.id;
                    this.editScenario(scenarioId);
                });
            });
            
        } catch (error) {
            console.error('Failed to render scenario table:', error);
        }
    }

    /**
     * Render alerts panel
     */
    async renderAlerts() {
        try {
            const alerts = await AlertService.getActiveAlerts();
            const container = document.getElementById('alerts-container');
            const alertCount = document.getElementById('alert-count');
            
            if (!container) return;
            
            // Update alert count badge
            if (alertCount) {
                alertCount.textContent = alerts.length;
                alertCount.style.display = alerts.length > 0 ? 'inline-block' : 'none';
            }
            
            container.innerHTML = alerts.map(alert => `
                <div class="alert-item ${alert.severity}">
                    <div class="alert-icon">
                        <i class="fas fa-${this.getAlertIcon(alert.severity)}"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-message">${alert.message}</div>
                        <div class="alert-time">${this.formatTime(alert.timestamp)}</div>
                    </div>
                    ${this.currentRole === 'admin' ? `
                        <button class="btn-action dismiss-alert" data-id="${alert.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
            `).join('');

            // Add dismiss event listeners for admin
            if (this.currentRole === 'admin') {
                container.querySelectorAll('.dismiss-alert').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const alertId = e.currentTarget.dataset.id;
                        await AlertService.dismissAlert(alertId);
                        await this.renderAlerts();
                    });
                });
            }
            
        } catch (error) {
            console.error('Failed to render alerts:', error);
        }
    }

    /**
     * Render calculator interface
     */
    async renderCalculator() {
        const container = document.getElementById('calculator-container');
        if (!container) return;
        
        // Load calculator HTML
        container.innerHTML = `
            <div class="calculator-grid">
                <div class="calculator-inputs">
                    <h3>Financial Inputs</h3>
                    <div class="input-group">
                        <label for="revenue">Revenue</label>
                        <input type="number" id="revenue" placeholder="0.00" ${this.currentRole === 'viewer' ? 'disabled' : ''}>
                    </div>
                    <div class="input-group">
                        <label for="opex">Operating Expenses</label>
                        <input type="number" id="opex" placeholder="0.00" ${this.currentRole === 'viewer' ? 'disabled' : ''}>
                    </div>
                    <div class="input-group">
                        <label for="salary">Salaries</label>
                        <input type="number" id="salary" placeholder="0.00" ${this.currentRole === 'viewer' ? 'disabled' : ''}>
                    </div>
                    <div class="input-group">
                        <label for="cogs">Cost of Goods Sold</label>
                        <input type="number" id="cogs" placeholder="0.00" ${this.currentRole === 'viewer' ? 'disabled' : ''}>
                    </div>
                    
                    <div class="calc-actions">
                        <button id="calculate-ebitda" class="btn-primary" ${this.currentRole === 'viewer' ? 'disabled' : ''}>
                            Calculate EBITDA
                        </button>
                        <button id="clear-calculator" class="btn-secondary">
                            Clear
                        </button>
                    </div>
                </div>
                
                <div class="calculator-results">
                    <h3>Results</h3>
                    <div class="result-item">
                        <span>EBITDA:</span>
                        <span id="calc-ebitda-result">$0.00</span>
                    </div>
                    <div class="result-item">
                        <span>EBITDA Margin:</span>
                        <span id="calc-margin-result">0.0%</span>
                    </div>
                    <div class="result-item">
                        <span>Gross Margin:</span>
                        <span id="calc-gross-margin">0.0%</span>
                    </div>
                </div>
            </div>
        `;

        // Add calculator event listeners
        const calculateBtn = document.getElementById('calculate-ebitda');
        if (calculateBtn && this.currentRole !== 'viewer') {
            calculateBtn.addEventListener('click', () => this.calculateEBITDA());
        }

        const clearBtn = document.getElementById('clear-calculator');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCalculator());
        }
    }

    /**
     * Render admin panel with all controls
     */
    async renderAdminPanel() {
        // Load pending approvals
        const pendingApprovals = await ApprovalService.getPendingApprovals();
        const approvalContainer = document.getElementById('approval-container');
        
        if (approvalContainer) {
            approvalContainer.innerHTML = pendingApprovals.map(approval => `
                <div class="approval-item">
                    <div class="approval-info">
                        <strong>${approval.scenarioName}</strong>
                        <span>Submitted by: ${approval.submittedBy}</span>
                    </div>
                    <div class="approval-actions">
                        <button class="btn-primary approve-btn" data-id="${approval.id}">
                            Approve
                        </button>
                        <button class="btn-danger reject-btn" data-id="${approval.id}">
                            Reject
                        </button>
                    </div>
                </div>
            `).join('');

            // Add approval/reject event listeners
            approvalContainer.querySelectorAll('.approve-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const approvalId = e.currentTarget.dataset.id;
                    await this.handleApproval(approvalId, true);
                });
            });

            approvalContainer.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const approvalId = e.currentTarget.dataset.id;
                    await this.handleApproval(approvalId, false);
                });
            });
        }
    }

    /**
     * Handle approval/rejection of scenarios
     */
    async handleApproval(approvalId, isApproved) {
        try {
            if (isApproved) {
                await ApprovalService.approve(approvalId, this.currentUser.id);
                this.showSuccess('Scenario approved successfully');
            } else {
                await ApprovalService.reject(approvalId, this.currentUser.id);
                this.showSuccess('Scenario rejected');
            }
            
            // Refresh admin panel
            await this.renderAdminPanel();
            await this.renderKPIs();
            await this.renderScenarioTable();
            
        } catch (error) {
            console.error('Approval failed:', error);
            this.showError('Failed to process approval');
        }
    }

    /**
     * Toggle formula lock (admin only)
     */
    async toggleFormulaLock() {
        if (this.currentRole !== 'admin') {
            this.showError('Only administrators can unlock formulas');
            return;
        }

        try {
            const isLocked = await CalculatorController.toggleLock();
            this.updateStatus(`Formulas ${isLocked ? 'locked' : 'unlocked'}`);
            
            // Update UI
            const formulaStatus = document.getElementById('formula-status');
            if (formulaStatus) {
                formulaStatus.textContent = `Formulas: ${isLocked ? 'Locked' : 'Unlocked'}`;
            }
            
            this.showSuccess(`Formulas ${isLocked ? 'locked' : 'unlocked'} successfully`);
            
        } catch (error) {
            console.error('Failed to toggle formula lock:', error);
            this.showError('Failed to toggle formula lock');
        }
    }

    /**
     * Toggle alert override (admin only)
     */
    async toggleAlertOverride(enabled) {
        if (this.currentRole !== 'admin') return;
        
        try {
            await AlertService.setOverride(enabled);
            this.updateStatus(`Alert override ${enabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Failed to toggle alert override:', error);
        }
    }

    /**
     * Switch to different role (demo purposes)
     */
    switchRole(newRole) {
        this.currentRole = newRole;
        RoleService.setRole(newRole);
        this.renderRoleAccess(newRole);
        this.showPanel(this.activePanel); // Refresh current panel
    }

    /**
     * Handle user logout
     */
    handleLogout() {
        // Reset to viewer role
        this.switchRole('viewer');
        this.currentUser = null;
        
        // Reset UI
        const usernameSpan = document.getElementById('username');
        if (usernameSpan) usernameSpan.textContent = 'Guest User';
        
        this.showSuccess('Logged out successfully');
        this.showPanel('dashboard');
    }

    /**
     * Start background updates for real-time data
     */
    startBackgroundUpdates() {
        // Update time every second
        setInterval(() => {
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleTimeString();
            }
        }, 1000);

        // Refresh data every 30 seconds
        setInterval(async () => {
            if (this.activePanel === 'dashboard') {
                await this.renderKPIs();
                await this.renderScenarioTable();
            }
            
            // Update last sync time
            const lastSyncElement = document.getElementById('last-sync');
            if (lastSyncElement) {
                lastSyncElement.textContent = `Last sync: ${new Date().toLocaleTimeString()}`;
            }
        }, 30000);
    }

    /**
     * Calculate EBITDA from input values
     */
    async calculateEBITDA() {
        if (this.currentRole === 'viewer') return;
        
        try {
            const revenue = parseFloat(document.getElementById('revenue').value) || 0;
            const opex = parseFloat(document.getElementById('opex').value) || 0;
            const salary = parseFloat(document.getElementById('salary').value) || 0;
            const cogs = parseFloat(document.getElementById('cogs').value) || 0;
            
            const results = await CalculatorController.calculate({
                revenue,
                opex,
                salary,
                cogs
            });
            
            // Update results display
            document.getElementById('calc-ebitda-result').textContent = 
                `$${results.ebitda.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            
            document.getElementById('calc-margin-result').textContent = 
                `${results.margin.toFixed(1)}%`;
            
            document.getElementById('calc-gross-margin').textContent = 
                `${results.grossMargin.toFixed(1)}%`;
            
            this.showSuccess('Calculation completed');
            
        } catch (error) {
            console.error('Calculation failed:', error);
            this.showError('Failed to calculate EBITDA');
        }
    }

    /**
     * Clear calculator inputs
     */
    clearCalculator() {
        ['revenue', 'opex', 'salary', 'cogs'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        
        ['calc-ebitda-result', 'calc-margin-result', 'calc-gross-margin'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = id.includes('ebitda') ? '$0.00' : '0.0%';
        });
    }

    /**
     * Create new scenario
     */
    async createNewScenario() {
        if (this.currentRole === 'viewer') return;
        
        // Implementation would open scenario creation modal
        this.showSuccess('Scenario creation started');
    }

    /**
     * Import Excel data
     */
    async importExcelData() {
        if (this.currentRole === 'viewer') return;
        
        // Implementation would handle file upload and parsing
        this.showSuccess('Excel import initiated');
    }

    /**
     * Update status message
     */
    updateStatus(message) {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.updateStatus(message);
        // Could add toast notification here
        console.log('Success:', message);
    }

    /**
     * Show error message
     */
    showError(message) {
        this.updateStatus(`Error: ${message}`);
        // Could add error toast here
        console.error('Error:', message);
        alert(message); // Replace with better notification in production
    }

    /**
     * Get icon for alert severity
     */
    getAlertIcon(severity) {
        switch (severity) {
            case 'high': return 'exclamation-triangle';
            case 'medium': return 'exclamation-circle';
            case 'low': return 'info-circle';
            default: return 'bell';
        }
    }

    /**
     * Format timestamp for display
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Additional panel renderers (stubs for now)
    async renderScenariosList() {
        // Implementation would load full scenarios list
        console.log('Rendering scenarios list');
    }

    async renderPortfolio() {
        // Implementation would load portfolio view
        console.log('Rendering portfolio');
    }

    async renderAuditTrail() {
        // Implementation would load audit trail
        console.log('Rendering audit trail');
    }

    async renderReports() {
        // Implementation would load reports
        console.log('Rendering reports');
    }

    async viewScenario(scenarioId) {
        // Implementation would show scenario details
        console.log('Viewing scenario:', scenarioId);
    }

    async editScenario(scenarioId) {
        if (this.currentRole === 'viewer') return;
        // Implementation would edit scenario
        console.log('Editing scenario:', scenarioId);
    }
}

/**
 * Role-based visibility helper function
 * @param {string[]} allowedRoles - List of roles that can see the element
 * @param {string} elementId - ID of the element to control
 * @param {boolean} forceShow - Force element to be shown (for internal use)
 */
function requireRole(allowedRoles, elementId, forceShow = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentRole = RoleService.getCurrentRole();
    const hasAccess = allowedRoles.includes(currentRole) || forceShow;
    
    if (hasAccess) {
        element.classList.remove('hidden');
        element.style.display = '';
    } else {
        element.classList.add('hidden');
        element.style.display = 'none';
    }
}

// Initialize dashboard when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const dashboard = new Dashboard();
        dashboard.initDashboard();
        
        // Make dashboard available globally for debugging
        window.dashboard = dashboard;
    });
}

// Export for module usage
export { Dashboard, requireRole };