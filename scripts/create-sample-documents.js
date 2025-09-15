// Sample script to create mock legal documents for testing
// This would typically connect to a real database or file system

const sampleDocuments = {
  rentalAgreement: {
    name: "Standard Rental Agreement",
    type: "rental",
    content: `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Agreement") is made between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant") for the rental of the property located at [PROPERTY ADDRESS] ("Property").

LEASE TERM: This lease begins on [START DATE] and ends on [END DATE].

RENT: Monthly rent is $[AMOUNT], due on the 1st of each month. Late fees of $50 apply after the 5th.

SECURITY DEPOSIT: Tenant must pay $[AMOUNT] as security deposit.

EARLY TERMINATION: Tenant may terminate early with 60 days notice and payment of 2 months rent penalty.

MAINTENANCE: Landlord responsible for major repairs; tenant responsible for minor maintenance.

AUTO-RENEWAL: This lease automatically renews for 12-month terms unless 30 days written notice is given.`,

    risks: [
      {
        text: "Late fees of $50 apply after the 5th",
        level: "yellow",
        explanation: "Moderate late fee with reasonable grace period",
      },
      {
        text: "payment of 2 months rent penalty",
        level: "yellow",
        explanation: "Early termination penalty is significant but predictable",
      },
      {
        text: "automatically renews for 12-month terms",
        level: "yellow",
        explanation: "Auto-renewal requires attention to notice periods",
      },
    ],
  },

  loanAgreement: {
    name: "Personal Loan Agreement",
    type: "loan",
    content: `PERSONAL LOAN AGREEMENT

Lender: [LENDER NAME]
Borrower: [BORROWER NAME]
Loan Amount: $[AMOUNT]
Interest Rate: [RATE]% APR
Term: [MONTHS] months

PAYMENT TERMS: Monthly payments of $[AMOUNT] due on the [DAY] of each month.

LATE FEES: $25 fee for payments more than 10 days late.

DEFAULT: Failure to make payment for 30 days constitutes default.

PREPAYMENT: Borrower may prepay without penalty.

COLLATERAL: This loan is unsecured.`,

    risks: [
      {
        text: "$25 fee for payments more than 10 days late",
        level: "green",
        explanation: "Reasonable late fee with generous grace period",
      },
      {
        text: "Failure to make payment for 30 days constitutes default",
        level: "yellow",
        explanation: "Standard default terms, but important to understand consequences",
      },
    ],
  },
}

console.log("Sample documents created for NyaySaar MVP")
console.log("Documents available:", Object.keys(sampleDocuments))

export default sampleDocuments
