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

const updateTrackingNumber = `
    mutation updateTrackingNumber($id: ID!, trackingSummary:[String], $userNotes: String, ) {
        updateTrackingNumber(input: {id: $id, trackingSummary: $trackingSummary, userNotes: $userNotes, }) {
      id
      trackingSummary
      userNotes
    }
  }
  


`

export {createTrackingNumber, deleteTrackingNumber, updateTrackingNumber};
  

