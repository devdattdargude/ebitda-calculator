// Test script for CalculatorController
import { CalculatorController } from './src/controllers/calculator.js';

async function testCalculatorController() {
    console.log('=== STEP 4 — Controller Wiring Test ===');
    
    try {
        // Test validation
        console.log('Testing validation...');
        const testData = {
            revenue: 1000000,
            opex: 300000,
            salary: 200000,
            cogs: 400000
        };
        
        const errors = CalculatorController.validateAll(testData);
        console.log('Validation errors:', errors);
        
        // Test calculation
        console.log('Testing calculation...');
        const results = await CalculatorController.calculate(testData);
        console.log('Calculation results:', results);
        
        // Test formula lock toggle
        console.log('Testing formula lock toggle...');
        const lockStatus = await CalculatorController.toggleLock();
        console.log('Formula lock status:', lockStatus);
        
        console.log('✅ Controller wiring test PASSED');
        return { success: true, results };
        
    } catch (error) {
        console.error('❌ Controller wiring test FAILED:', error);
        return { success: false, error: error.message };
    }
}

// Run the test
testCalculatorController();
