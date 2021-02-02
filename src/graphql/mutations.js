const createTrackingNumber = `
    mutation createTrackingNumber($userID: String!, $trackingNumber: String!, $carrier: String!, $trackingSummary: [String!]) {
        createTrackingNumber(input: {
                                        userID: $userID, 
                                        trackingNumber: $trackingNumber, 
                                        carrier: $carrier,
                                        trackingSummary: $trackingSummary,
                                    }){
                                        id
                                    }
    }
  `


export {createTrackingNumber};
  

