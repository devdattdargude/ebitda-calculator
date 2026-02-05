// Layer 3 - Business Logic Layer (Pure Calculation Engine)
// Purpose: Financial formulas only. No DOM. No UI touching. Just math.

const FinanceEngine = {
    
    calcEBITDA(revenue, opex, salary) {
        return revenue - opex - salary;
    },
    
    calcEBITDAMargin(ebitda, revenue) {
        if (revenue === 0) return 0;
        return (ebitda / revenue) * 100;
    },
    
    calcNetProfit(ebitda, interest, tax, depreciation) {
        const pbt = ebitda - interest - depreciation;
        const taxAmount = pbt * (tax / 100);
        return pbt - taxAmount;
    },
    
    calcNetProfitMargin(netProfit, revenue) {
        if (revenue === 0) return 0;
        return (netProfit / revenue) * 100;
    }
};

// Layer 4 - Controller Layer (Glue Layer)
// Purpose: Connect UI ↔ FinanceEngine ↔ Output
// Rule: Controller reads inputs → calls engine → updates screen.
// No formulas here. No CSS here. Pure coordination.

const AppController = {
    
    getInputValue(id) {
        return Number(document.getElementById(id).value) || 0;
    },
    
    setOutput(id, value) {
        document.getElementById(id).innerText = value.toFixed(2);
    },
    
    calculate() {
        // Get input values
        const revenue = this.getInputValue("revenue");
        const opex = this.getInputValue("opex");
        const salary = this.getInputValue("salary");
        
        // Calculate using FinanceEngine
        const ebitda = FinanceEngine.calcEBITDA(revenue, opex, salary);
        
        // Update UI
        this.setOutput("ebitda", ebitda);
    }
};
