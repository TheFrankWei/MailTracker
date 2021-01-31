const getTrackingNumbersByUser = `
    query getTrackingNumbersByUser($userID: String!) {
        listTrackingNumbers(filter: {userID: {eq:$userID}}) {
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
  

