const createTrackingNumber = `
    mutation createTrackingNumber($userID: String!) {
        createTrackingNumber(input: {
                                        userID: $userID, 
                                        trackingNumber: $trackingNumber, 
                                        carrier: $carrier,
                                        trackingSummary: $trackingSummary,
                                        userNotes: $userNotes,

                                    }){
                                        id
                                    }
    }
  `


export {createTrackingNumber};
  

