class Plans {

    get freePlan() { return '[data-qa="plans-btn-free"]' }
    get standardPlan() { return '[data-qa="plans-btn-standard"]' }

}

module.exports = new Plans();