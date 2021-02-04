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

const deleteTrackingNumber = `
    mutation deleteTrackingNumber($id: ID! ) {
        deleteTrackingNumber(input: {id: $id}) {
      id
    }
  }


`

export {createTrackingNumber, deleteTrackingNumber};
  

