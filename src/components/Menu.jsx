import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, Loader, Button, Menu } from 'semantic-ui-react'
import Logo from '../../public/optrispace.svg'
import useTranslation from 'next-translate/useTranslation'
import { ROUTES } from '../lib/routes'

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
        <Link href={ROUTES.HOME} passHref>
          <a>
            <Image src={Logo} alt="OptriSpace" width="100" height="42" />
          </a>
        </Link>
      </Menu.Item>

      {isConnected && currentAccount && accountBalance ? (
        <>
          <Dropdown item text={t('components.menu.browse.main')}>
            <Dropdown.Menu>
              <Link href={ROUTES.JOBS_LIST} passHref>
                <Dropdown.Item text={t('components.menu.browse.jobs')} />
              </Link>
              <Link href={ROUTES.VACANCIES_LIST} passHref>
                <Dropdown.Item
                  text={t('components.menu.browse.vacancies')}
                  disabled
                />
              </Link>
              <Link href={ROUTES.FREELANCERS_LIST} passHref>
                <Dropdown.Item text={t('components.menu.browse.freelancers')} />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text={t('components.menu.customer.main')}>
            <Dropdown.Menu>
              <Link href={ROUTES.CUSTOMER_JOBS_LIST} passHref>
                <Dropdown.Item text={t('components.menu.customer.my_jobs')} />
              </Link>
              <Link href={ROUTES.CUSTOMER_CONTRACTS_LIST} passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.my_contracts')}
                />
              </Link>
              <Link href={ROUTES.CUSTOMER_VACANCIES_LIST} passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.my_vacancies')}
                  disabled
                />
              </Link>
              <Dropdown.Divider />
              <Link href={ROUTES.ADD_JOB} passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.add_new_job')}
                />
              </Link>
              <Link href={ROUTES.ADD_VACANCIES} passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.add_new_vacancy')}
                  disabled
                />
              </Link>
              <Dropdown.Divider />
              <Link href={ROUTES.CUSTOMER_DASHBOARD} passHref>
                <Dropdown.Item
                  text={t('components.menu.customer.my_profile')}
                  disabled
                />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text={t('components.menu.freelancer.main')}>
            <Dropdown.Menu>
              <Link href={ROUTES.FREELANCER_APPLICATIONS_LIST} passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_applications')}
                />
              </Link>
              <Link href={ROUTES.FREELANCER_CONTRACTS_LIST} passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_contracts')}
                />
              </Link>
              <Link href={ROUTES.FREELANCER_RESUMES_LIST} passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_resumes')}
                  disabled
                />
              </Link>
              <Dropdown.Divider />
              <Link href={ROUTES.FREELANCER_DASHBOARD} passHref>
                <Dropdown.Item
                  text={t('components.menu.freelancer.my_profile')}
                  disabled
                />
              </Link>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown item text={t('components.menu.node_owner.main')}>
            <Dropdown.Menu>
              <Link href={ROUTES.FRONTEND_NODES_LIST} passHref>
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
