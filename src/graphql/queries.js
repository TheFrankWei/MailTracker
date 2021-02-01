const getTrackingNumbersByUser = `
    query getTrackingNumbersByUser($userID: String!) {
        listTrackingNumbers(filter: {userID: {contains: $userID}}) {
            items {
                carrier
                trackingNumber
                trackingSummary
                userNotes
            }
        }
    }
  `


export {getTrackingNumbersByUser};
  

