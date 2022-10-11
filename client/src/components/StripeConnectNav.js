import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Card, Avatar, Badge } from 'antd'
import moment from 'moment'
import { getAccountBalance, currencyFormatter, payoutSetting } from '../actions/stripe'
import { SettingOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

const { Meta } = Card
const { Ribbon } = Badge

const StripeConnectNav = () => {
    
    const [balance, setBalance] = useState(0)
    const { auth } = useAuth()
    const { user, token } = auth

    useEffect(() => {
        getAccountBalance(token)
            .then(res => {                
                setBalance(res.data)
            })
    }, [token])

    const handlePayoutSettings = async () => {         
        try {
            const res = await payoutSetting(token)                        
            window.location.href = res.data.url            
        } catch (err) {
            console.log(err)            
            toast("Unable to access settings. Try again")
        }
    }

  return (
      <div className="d-flex justify-content-around">
          <Card>
              <Meta
                  avatar={<Avatar style={{ color: '#fff', backgroundColor: '#7265e6' }}>{user.name[0]}</Avatar>}
                  title={user.name}
                  description={`Joined ${moment(user.createdAt).fromNow()}`}
              />
          </Card>
          {auth &&
              auth.user &&
              auth.user.stripe_seller &&
              auth.user.stripe_seller.charges_enabled && (
                <>
                  <Ribbon text="Available" color="green">
                      <Card className="bg-light pt-3">
                          {balance &&
                              balance.pending &&
                              balance.pending.map((balancepending, i) => (
                                  <span key={i} className="lead">
                                      {currencyFormatter(balancepending)}
                                  </span>
                              ))}
                      </Card>
                  </Ribbon>  
                  <Ribbon text="Payouts" color="green">
                      <Card onClick={handlePayoutSettings} className="bg-light pointer">
                          <SettingOutlined className="h5 pt-4" />
                      </Card>
                  </Ribbon>  
                </>
          )}         
      </div>
  )
}

export default StripeConnectNav