// Test script for Save Scenario Flow
import { CalculatorController } from './src/controllers/calculator.js';
import { StorageService } from './src/services/storage.js';

async function testSaveScenarioFlow() {
    console.log('=== STEP 5 — Save Scenario Flow Test ===');
    
    try {
        // Step 1: Calculate EBITDA
        console.log('Step 1: Calculating EBITDA...');
        const inputData = {
            revenue: 1000000,
            opex: 300000,
            salary: 200000,
            cogs: 400000
        };
        
        const results = await CalculatorController.calculate(inputData);
        console.log('✅ Calculation results:', results);
        
        // Step 2: Save scenario to local storage
        console.log('Step 2: Saving scenario to local storage...');
        const scenarioData = {
            name: 'Test Scenario',
            property: 'Property A',
            inputs: inputData,
            results: results
        };
        
        StorageService.saveScenario(
            scenarioData.name,
            scenarioData.inputs,
            scenarioData.results,
            scenarioData.property
        );
        console.log('✅ Scenario saved to local storage');
        
        // Step 3: Verify local storage
        console.log('Step 3: Verifying local storage...');
        const allScenarios = StorageService.getAll();
        const savedScenario = allScenarios.find(s => s.name === 'Test Scenario');
        
        if (savedScenario) {
            console.log('✅ Scenario found in local storage:', savedScenario);
        } else {
            throw new Error('Scenario not found in local storage');
        }
        
        // Step 4: Test backend API save
        console.log('Step 4: Testing backend API save...');
        const payload = {
            id: 'test-scenario-123',
            name: 'Test Scenario API',
            property: 'Property B',
            ownerId: 'user-123',
            updatedAt: new Date().toISOString(),
            scenarioType: 'ACTUAL',
            inputs: inputData,
            results: results,
            audit: {
                role: 'ANALYST',
                version: 'v1',
                savedAt: new Date().toISOString()
            }
        };
        
        const apiResponse = await fetch('http://localhost:4001/api/scenario/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (apiResponse.ok) {
            const apiResult = await apiResponse.json();
            console.log('✅ Backend API save successful:', apiResult);
        } else {
            throw new Error(`Backend API save failed: ${apiResponse.status}`);
        }
        
        // Step 5: Verify backend storage
        console.log('Step 5: Verifying backend storage...');
        const getAllResponse = await fetch('http://localhost:4001/api/scenario/all');
        if (getAllResponse.ok) {
            const allBackendScenarios = await getAllResponse.json();
            const backendScenario = allBackendScenarios.find(s => s.name === 'Test Scenario API');
            
            if (backendScenario) {
                console.log('✅ Scenario found in backend:', backendScenario);
            } else {
                throw new Error('Scenario not found in backend');
            }
        }
        
        console.log('✅ Save scenario flow test PASSED');
        return { success: true, payload, results };
        
    } catch (error) {
        console.error('❌ Save scenario flow test FAILED:', error);
        return { success: false, error: error.message };
    }
}

// Run the test
testSaveScenarioFlow();
