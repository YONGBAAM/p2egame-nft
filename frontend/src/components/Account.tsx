import React, { FC } from 'react'

interface AccountProps {
    account: string;
}

const Account: FC<AccountProps> = ({ account }) => {
    return (
        <div>
            {account.length <= 8 ? account : account.substring(0, 4) + ".." + account.substring(account.length-4, account.length)}
        </div>
    )
}

export default Account