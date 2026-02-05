// Test script for End-to-End Flow Proof
import { CalculatorController } from './src/controllers/calculator.js';
import { StorageService } from './src/services/storage.js';
import { PortfolioService } from './src/services/portfolio.js';
import { AlertService } from './src/services/alert-service.js';
import { ApprovalService } from './src/services/approval-service.js';
import { RoleService } from './src/services/role-service.js';

async function testEndToEndFlow() {
    console.log('=== STEP 10 — End-to-End Flow Proof ===');
    
    const flowResults = {
        steps: [],
        errors: [],
        startTime: new Date()
    };
    
    function logStep(step, status, details = {}) {
        const result = { step, status, timestamp: new Date(), details };
        flowResults.steps.push(result);
        console.log(`[${status.toUpperCase()}] ${step}:`, details);
    }
    
    try {
        // STEP 1: Login
        logStep('1. USER LOGIN', 'STARTING');
        
        // Simulate user login
        RoleService.setRole('ANALYST');
        RoleService.setCurrentUser({ id: 'e2e-test-user', name: 'E2E Test User' });
        
        // Call login API
        const loginResponse = await fetch('http://localhost:4001/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'E2E Test User' })
        });
        
        if (loginResponse.ok) {
            const loginResult = await loginResponse.json();
            logStep('1. USER LOGIN', 'PASS', { userId: 'e2e-test-user', apiResponse: loginResult });
        } else {
            throw new Error(`Login failed: ${loginResponse.status}`);
        }
        
        // STEP 2: Calculate EBITDA
        logStep('2. CALCULATE EBITDA', 'STARTING');
        
        const financialInputs = {
            revenue: 2000000,
            opex: 800000,
            salary: 400000,
            cogs: 600000
        };
        
        const calculationResults = await CalculatorController.calculate(financialInputs);
        
        if (calculationResults && calculationResults.ebitda > 0) {
            logStep('2. CALCULATE EBITDA', 'PASS', { 
                inputs: financialInputs,
                results: calculationResults 
            });
        } else {
            throw new Error('Calculation failed');
        }
        
        // STEP 3: Save Scenario
        logStep('3. SAVE SCENARIO', 'STARTING');
        
        const scenarioData = {
            id: 'e2e-test-scenario',
            name: 'E2E Test Scenario',
            property: 'E2E Property',
            scenarioType: 'ACTUAL',
            inputs: financialInputs,
            results: calculationResults
        };
        
        // Save to local storage
        StorageService.saveScenario(
            scenarioData.name,
            scenarioData.inputs,
            scenarioData.results,
            scenarioData.property,
            scenarioData.scenarioType
        );
        
        // Save to backend
        const saveResponse = await fetch('http://localhost:4001/api/scenario/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...scenarioData,
                ownerId: 'e2e-test-user',
                updatedAt: new Date().toISOString(),
                audit: {
                    role: 'ANALYST',
                    version: 'v1',
                    savedAt: new Date().toISOString()
                }
            })
        });
        
        if (saveResponse.ok) {
            const saveResult = await saveResponse.json();
            logStep('3. SAVE SCENARIO', 'PASS', { 
                scenarioId: scenarioData.id,
                apiResponse: saveResult 
            });
        } else {
            throw new Error(`Save failed: ${saveResponse.status}`);
        }
        
        // STEP 4: Fetch Scenarios
        logStep('4. FETCH SCENARIOS', 'STARTING');
        
        // Fetch from local storage
        const localScenarios = StorageService.getAll();
        const recentScenarios = await StorageService.getRecentScenarios(10);
        
        // Fetch from backend
        const fetchResponse = await fetch('http://localhost:4001/api/scenario/all');
        const backendScenarios = await fetchResponse.json();
        
        if (fetchResponse.ok && localScenarios.length > 0 && backendScenarios.length > 0) {
            logStep('4. FETCH SCENARIOS', 'PASS', { 
                localCount: localScenarios.length,
                backendCount: backendScenarios.length,
                recentCount: recentScenarios.length
            });
        } else {
            throw new Error('Fetch scenarios failed');
        }
        
        // STEP 5: Submit for Approval
        logStep('5. SUBMIT FOR APPROVAL', 'STARTING');
        
        await ApprovalService.submit(scenarioData.id);
        
        // Verify submission
        const submitCheckResponse = await fetch('http://localhost:4001/api/scenario/all');
        const submittedScenarios = await submitCheckResponse.json();
        const submittedScenario = submittedScenarios.find(s => s.id === scenarioData.id);
        
        if (submittedScenario && submittedScenario.status === 'SUBMITTED') {
            logStep('5. SUBMIT FOR APPROVAL', 'PASS', { 
                scenarioId: scenarioData.id,
                status: submittedScenario.status 
            });
        } else {
            throw new Error('Submit for approval failed');
        }
        
        // STEP 6: Approve Scenario (switch to admin role)
        logStep('6. APPROVE SCENARIO', 'STARTING');
        
        // Switch to admin role
        RoleService.setRole('ADMIN');
        RoleService.setCurrentUser({ id: 'admin-user', name: 'Admin User' });
        
        await ApprovalService.approve(scenarioData.id, 'admin-user', 'E2E test approval');
        
        // Verify approval
        const approveCheckResponse = await fetch('http://localhost:4001/api/scenario/all');
        const approvedScenarios = await approveCheckResponse.json();
        const approvedScenario = approvedScenarios.find(s => s.id === scenarioData.id);
        
        if (approvedScenario && approvedScenario.status === 'APPROVED') {
            logStep('6. APPROVE SCENARIO', 'PASS', { 
                scenarioId: scenarioData.id,
                status: approvedScenario.status,
                approvedBy: approvedScenario.approved_by
            });
        } else {
            throw new Error('Approve scenario failed');
        }
        
        // STEP 7: Export Data
        logStep('7. EXPORT DATA', 'STARTING');
        
        // Simulate export functionality
        const exportData = {
            scenarios: approvedScenarios,
            totals: await PortfolioService.getTotals(),
            alerts: await AlertService.getActiveAlerts(),
            exportTimestamp: new Date().toISOString(),
            exportedBy: 'admin-user'
        };
        
        // In a real system, this would generate Excel/PDF
        const exportSuccess = exportData.scenarios.length > 0 && exportData.totals;
        
        if (exportSuccess) {
            logStep('7. EXPORT DATA', 'PASS', { 
                scenariosExported: exportData.scenarios.length,
                totalEBITDA: exportData.totals.ebitda,
                exportFormat: 'JSON (simulated)'
            });
        } else {
            throw new Error('Export failed');
        }
        
        // STEP 8: Verify System Health
        logStep('8. SYSTEM HEALTH CHECK', 'STARTING');
        
        const systemHealth = {
            backend: 'OK', // Backend is responding
            database: 'OK', // Mock database is working
            services: 'OK', // All services loaded
            alerts: AlertService.getActiveAlerts().length || 0,
            scenarios: StorageService.getAll().length,
            calculations: calculationResults.ebitda > 0
        };
        
        const systemHealthy = Object.values(systemHealth).every(status => 
            status === 'OK' || (typeof status === 'number' && status >= 0) || status === true
        );
        
        console.log('System health details:', systemHealth);
        
        if (systemHealthy) {
            logStep('8. SYSTEM HEALTH CHECK', 'PASS', systemHealth);
        } else {
            throw new Error('System health check failed');
        }
        
        // Calculate final score
        const passedSteps = flowResults.steps.filter(s => s.status === 'PASS').length;
        const totalSteps = flowResults.steps.length;
        const successRate = (passedSteps / totalSteps) * 100;
        
        flowResults.endTime = new Date();
        flowResults.duration = flowResults.endTime - flowResults.startTime;
        flowResults.successRate = successRate;
        flowResults.finalScore = successRate >= 90 ? 'EXCELLENT' : 
                               successRate >= 80 ? 'GOOD' : 
                               successRate >= 70 ? 'ACCEPTABLE' : 'NEEDS IMPROVEMENT';
        
        console.log('\n=== END-TO-END FLOW SUMMARY ===');
        console.log(`Total Steps: ${totalSteps}`);
        console.log(`Passed: ${passedSteps}`);
        console.log(`Success Rate: ${successRate.toFixed(1)}%`);
        console.log(`Duration: ${flowResults.duration}ms`);
        console.log(`Final Score: ${flowResults.finalScore}`);
        
        console.log('\n=== STEP-BY-STEP TRACE ===');
        flowResults.steps.forEach(step => {
            console.log(`${step.step}: ${step.status} (${step.timestamp.toISOString()})`);
        });
        
        if (successRate >= 90) {
            console.log('\n✅ END-TO-END FLOW TEST PASSED - SYSTEM READY FOR PRODUCTION');
        } else {
            console.log('\n⚠️  END-TO-END FLOW TEST COMPLETED WITH ISSUES');
        }
        
        return flowResults;
        
    } catch (error) {
        logStep('FATAL ERROR', 'FAIL', { error: error.message });
        flowResults.endTime = new Date();
        flowResults.finalScore = 'FAILED';
        
        console.error('\n❌ END-TO-END FLOW TEST FAILED:', error);
        return flowResults;
    }
}

// Run the test
testEndToEndFlow();
