const getTrackingNumbersByUser = `
    query getTrackingNumbersByUser($userID: String!) {
        listTrackingNumbers(filter: {userID: {contains: $userID}}) {
            items {
                userID
                id
                carrier
                trackingNumber
                trackingSummary
                userNotes
            }
        }
    }
  `


export {getTrackingNumbersByUser};
  

