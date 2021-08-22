class KeyModel {
    constructor(_id, available) {
        this._id = _id
        this.available = available
    }
}


/*
    default expireDate value is 12 months
    expireDate and createdAt is miniseconds so far from 01/ 01/ 1970
    userId is optional
*/
class UrlModel {
    constructor(
        hash,
        userId,
        originUrl,
        expireDate
    ) {

        this._id = hash
        this.userId = userId
        this.originUrl = originUrl
        this.expireDate = expireDate
        this.createdAt =  Date.now()

        if (!this.expireDate) {
            let oneYearMiniseconds = 1000 * 60 * 60 * 24 * 365
            this.expireDate = this.createdAt + oneYearMiniseconds
        }
    }
}

class UserModel {
    constructor(
        Avatar,
        Email,
        FacebookID,
        FullName,
        Password,
    ) 
    {
        this.Avatar = Avatar
        this.Email = Email
        this.FacebookID = FacebookID
        this.FullName = FullName
        this.CreatedAt = Date.now()
        this.Password = Password
    }
}

module.exports = {
    KeyModel,
    UrlModel,
    UserModel,
}