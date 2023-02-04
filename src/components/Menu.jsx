import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, Loader, Button, Menu } from 'semantic-ui-react'
import Logo from '../../public/optrispace.svg'

const MenuComponent = ({
  isConnected,
  isReconnecting,
  connect,
  disconnect,
  accountBalance,
  currentAccount,
}) => {
  return (
    <Menu stackable secondary style={{ marginTop: '1em' }}>
      <Menu.Item>
        <Link href="/" passHref>
          <a>
            <Image src={Logo} alt="OptriSpace" width="100" height="42" />
          </a>
        </Link>
      </Menu.Item>

      {isConnected && currentAccount && accountBalance ? (
        <>
          <Dropdown item text="Browse">
            <Dropdown.Menu>
              <Link href="/jobs" passHref>
                <Dropdown.Item text="Jobs" />
              </Link>
              <Link href="/vacancies" passHref>
                <Dropdown.Item text="Vacancies" disabled />
              </Link>
              <Link href="/freelancers" passHref>
                <Dropdown.Item text="Freelancers" />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text="Customer">
            <Dropdown.Menu>
              <Link href="/customer/jobs" passHref>
                <Dropdown.Item text="My Jobs" />
              </Link>
              <Link href="/customer/contracts" passHref>
                <Dropdown.Item text="My Contracts" />
              </Link>
              <Link href="/customer/vacancies" passHref>
                <Dropdown.Item text="My Vacancies" disabled />
              </Link>
              <Dropdown.Divider />
              <Link href="/jobs/new" passHref>
                <Dropdown.Item text="Post New Job" />
              </Link>
              <Link href="/vacancies/new" passHref>
                <Dropdown.Item text="Post New Vacancy" disabled />
              </Link>
              <Dropdown.Divider />
              <Link href="/customer" passHref>
                <Dropdown.Item text="My Profile" disabled />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text="Freelancer">
            <Dropdown.Menu>
              <Link href="/freelancer/applications" passHref>
                <Dropdown.Item text="My Applications" />
              </Link>
              <Link href="/freelancer/contracts" passHref>
                <Dropdown.Item text="My Contracts" />
              </Link>
              <Link href="/freelancer/resumes" passHref>
                <Dropdown.Item text="My Resumes" disabled />
              </Link>
              <Dropdown.Divider />
              <Link href="/freelancer" passHref>
                <Dropdown.Item text="My Profile" disabled />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text="Node Owner">
            <Dropdown.Menu>
              <Link href="/frontend_nodes" passHref>
                <Dropdown.Item text="My Frontend Nodes" disabled />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          {isReconnecting ? (
            <Menu.Menu position="right">
              <Menu.Item>
                <Loader size="small" active inline />
              </Menu.Item>
            </Menu.Menu>
          ) : (
            <Menu.Menu position="right">
              <Menu.Item>
                <b>
                  Balance:{' '}
                  {+accountBalance.formatted > 0
                    ? (+accountBalance.formatted).toFixed(6)
                    : accountBalance.formatted}
                  {` ${accountBalance.symbol}`}
                </b>
              </Menu.Item>

              <Menu.Item>
                <Button secondary onClick={() => disconnect()}>
                  {`Disconnect (${currentAccount.slice(0, 6)}...)`}
                </Button>
              </Menu.Item>
            </Menu.Menu>
          )}
        </>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item>
            <Button color="orange" onClick={() => connect()}>
              Connect Wallet
            </Button>
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  )
}

export default MenuComponent
