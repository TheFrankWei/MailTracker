const createTrackingNumber = `
    mutation createTrackingNumber($userID: String!, $trackingNumber: String!, $carrier: String!, $trackingSummary: [String!]) {
        createTrackingNumber(input: {
                                        userID: $userID, 
                                        trackingNumber: $trackingNumber, 
                                        carrier: $carrier,
                                        trackingSummary: $trackingSummary,
                                    }){
                                        id
                                        _version
                                    }
    }
  `

const deleteTrackingNumber = `
    mutation deleteTrackingNumber($id: ID!, $_version: Int! ) {
        deleteTrackingNumber(input: {id: $id, _version: $_version}) {
      id
    }
  }


`

export {createTrackingNumber, deleteTrackingNumber};
  

