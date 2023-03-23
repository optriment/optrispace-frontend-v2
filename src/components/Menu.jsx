import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, Loader, Button, Menu } from 'semantic-ui-react'
import Logo from '../../public/optrispace.svg'
import useTranslation from 'next-translate/useTranslation'

const MenuComponent = ({
  isConnected,
  isReconnecting,
  connect,
  disconnect,
  accountBalance,
  currentAccount,
}) => {
  const { t } = useTranslation('common')

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
          <Dropdown item text={t('components.menu.browse.main')}>
            <Dropdown.Menu>
              <Link href="/jobs" passHref>
                <Dropdown.Item text={t('components.menu.browse.jobs')} />
              </Link>
              <Link href="/vacancies" passHref>
                <Dropdown.Item
                  text={t('components.menu.browse.vacancies')}
                  disabled
                />
              </Link>
              <Link href="/freelancers" passHref>
                <Dropdown.Item text={t('components.menu.browse.freelancers')} />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text={t('components.menu.customer.main')}>
            <Dropdown.Menu>
              <Link href="/customer/jobs" passHref>
                <Dropdown.Item text={t('components.menu.customer.my_jobs')} />
              </Link>
              <Link href="/customer/contracts" passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.my_contracts')}
                />
              </Link>
              <Link href="/customer/vacancies" passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.my_vacancies')}
                  disabled
                />
              </Link>
              <Dropdown.Divider />
              <Link href="/jobs/new" passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.add_new_job')}
                />
              </Link>
              <Link href="/vacancies/new" passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.add_new_vacancy')}
                  disabled
                />
              </Link>
              <Dropdown.Divider />
              <Link href="/customer" passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.my_profile')}
                  disabled
                />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text={t('components.menu.freelancer.main')}>
            <Dropdown.Menu>
              <Link href="/freelancer/applications" passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_applications')}
                />
              </Link>
              <Link href="/freelancer/contracts" passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_contracts')}
                />
              </Link>
              <Link href="/freelancer/resumes" passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_resumes')}
                  disabled
                />
              </Link>
              <Dropdown.Divider />
              <Link href="/freelancer" passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_profile')}
                  disabled
                />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text={t('components.menu.node_owner.main')}>
            <Dropdown.Menu>
              <Link href="/frontend_nodes" passHref>
                <Dropdown.Item
                  text={t('components.menu.node_owner.my_frontend_nodes')}
                  disabled
                />
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
                  {t('components.menu.balance', {
                    balance:
                      +accountBalance.formatted > 0
                        ? (+accountBalance.formatted).toFixed(6)
                        : accountBalance.formatted,
                    symbol: accountBalance.symbol,
                  })}
                </b>
              </Menu.Item>

              <Menu.Item>
                <Button secondary onClick={() => disconnect()}>
                  {t('components.menu.disconnect_wallet', {
                    address: currentAccount.slice(0, 6),
                  })}
                </Button>
              </Menu.Item>
            </Menu.Menu>
          )}
        </>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item>
            <Button color="orange" onClick={() => connect()}>
              {t('components.menu.connect_wallet')}
            </Button>
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  )
}

export default MenuComponent
