// Test script for Fetch Scenario Flow
import { StorageService } from './src/services/storage.js';

async function testFetchScenarioFlow() {
    console.log('=== STEP 6 — Fetch Scenario Flow Test ===');
    
    try {
        // Setup: Add test data to local storage
        console.log('Setup: Adding test data to local storage...');
        await StorageService.load();
        
        // Add test scenarios
        StorageService.saveScenario('Test Scenario 1', 
            { revenue: 1000000, opex: 300000, salary: 200000, cogs: 400000 },
            { ebitda: 500000, ebitdaMargin: 50, grossMargin: 60 },
            'Property A', 'ACTUAL'
        );
        
        StorageService.saveScenario('Test Scenario 2', 
            { revenue: 800000, opex: 250000, salary: 150000, cogs: 350000 },
            { ebitda: 400000, ebitdaMargin: 50, grossMargin: 56.25 },
            'Property B', 'BUDGET'
        );
        
        console.log('✅ Test data added');
        
        // Step 1: Test local storage fetch
        console.log('Step 1: Testing local storage fetch...');
        const localScenarios = StorageService.getAll();
        console.log('✅ Local scenarios retrieved:', localScenarios.length, 'items');
        
        // Step 2: Test getRecentScenarios
        console.log('Step 2: Testing getRecentScenarios...');
        const recentScenarios = await StorageService.getRecentScenarios(5);
        console.log('✅ Recent scenarios retrieved:', recentScenarios.length, 'items');
        console.log('Sample scenario:', recentScenarios[0]);
        
        // Step 3: Test backend API fetch
        console.log('Step 3: Testing backend API fetch...');
        const apiResponse = await fetch('http://localhost:4001/api/scenario/all');
        
        if (apiResponse.ok) {
            const backendScenarios = await apiResponse.json();
            console.log('✅ Backend scenarios retrieved:', backendScenarios.length, 'items');
            console.log('Sample backend scenario:', backendScenarios[0]);
        } else {
            throw new Error(`Backend API fetch failed: ${apiResponse.status}`);
        }
        
        // Step 4: Test dashboard table rendering simulation
        console.log('Step 4: Testing dashboard table rendering simulation...');
        
        // Simulate the table rendering logic from dashboard.js
        function simulateTableRendering(scenarios) {
            if (!Array.isArray(scenarios)) {
                throw new Error('Scenarios is not an array');
            }
            
            const tableRows = scenarios.map(scenario => {
                return {
                    name: scenario.name || 'Unknown',
                    property: scenario.property || 'N/A',
                    type: scenario.scenarioType || 'Unknown',
                    ebitda: scenario.results?.ebitda || 0,
                    margin: scenario.results?.ebitdaMargin || 0,
                    status: scenario.status || 'Draft'
                };
            });
            
            return tableRows;
        }
        
        const tableData = simulateTableRendering(recentScenarios);
        console.log('✅ Table data generated:', tableData.length, 'rows');
        console.log('Sample table row:', tableData[0]);
        
        // Step 5: Verify data integrity
        console.log('Step 5: Verifying data integrity...');
        
        const hasValidEBITDA = tableData.some(row => row.ebitda > 0);
        const hasValidNames = tableData.every(row => row.name && row.name !== 'Unknown');
        const hasValidProperties = tableData.every(row => row.property);
        
        if (hasValidEBITDA && hasValidNames && hasValidProperties) {
            console.log('✅ Data integrity verified');
        } else {
            console.log('Data integrity details:', {
                hasValidEBITDA,
                hasValidNames,
                hasValidProperties,
                tableDataLength: tableData.length
            });
            throw new Error('Data integrity check failed');
        }
        
        console.log('✅ Fetch scenario flow test PASSED');
        return { 
            success: true, 
            localCount: localScenarios.length,
            recentCount: recentScenarios.length,
            tableRows: tableData.length
        };
        
    } catch (error) {
        console.error('❌ Fetch scenario flow test FAILED:', error);
        return { success: false, error: error.message };
    }
}

// Run the test
testFetchScenarioFlow();
