import React from 'react'
import Link from 'next/link'
import { Image, Container, Divider, Header, List } from 'semantic-ui-react'

export const LandingScreen = () => {
  return (
    <>
      <Container textAlign="center">
        <Image
          src="/optrispace-logo-with-slogan.png"
          alt="OptriSpace"
          bordered
          rounded
          centered
        />
      </Container>

      <Divider hidden />
      <Divider />
      <Divider hidden />

      <Container text textAlign="justified">
        <Header as="h2" content="What is OptriSpace" />

        <p>
          We are OptriSpace - an international team who got together to face a
          challenge and build a brand-new platform for people like us:
          freelancers, managers and entrepreneurs. We provide a platform for
          people looking for jobs or for professionals for their projects.
        </p>

        <p>
          Our platform is based on the blockchain technology and uses
          cryptocurrency as a payment method. That makes OptriSpace secure and
          fast. Smart Contracts protect customers and freelancers from third
          parties and middlemen. Smart Contracts handle all logic depends on
          terms and conditions which have to be signed by both participants.
        </p>

        <Header as="h2" content="How OptriSpace works" />

        <Header as="h3" content="1. Customer posts a job on the platform" />

        <p>
          A customer lists a particular task on the platform and picks a person
          who wants to work with upon this task. Both of them use our internal
          messaging system to discuss terms and conditions (price, acceptance
          criteria, etc.) of a future contract.
        </p>

        <Header
          as="h3"
          content="2. Freelancer agrees to terms, accepts and signs the contract"
        />

        <p>
          At this stage the freelancer has to accept the contract on our
          platform.
          <br />
          After that the customer will be able to create a Smart Contract on
          blockchain.
        </p>

        <Header as="h3" content="3. Customer funds the Smart Contract" />

        <p>
          The customer initiates transaction on blockchain to send money from
          own wallet to Smart Contract address. The funds are held on the Smart
          Contract address until all conditions have been met.
        </p>

        <Header
          as="h3"
          content="4. Freelancer starts working on the task and delivers a result"
        />

        <p>
          The freelancer can&apos;t request money before the customer accepts
          the job result. The freelancer has to do best to finish the task to
          get paid.
        </p>

        <Header as="h3" content="5. Customer approves money withdrawal" />

        <p>
          The customer gets the work result and approves money withdrawal from
          the Smart Contract by the freelancer.
        </p>

        <Header as="h3" content="6. Freelancer withdraws money" />

        <p>
          Freelancer requests money from the Smart Contract to it&apos;s own
          crypto wallet.
        </p>

        <Header as="h2" content="What is inside?" />

        <List bulleted>
          <List.Item>
            Powered by{' '}
            <Link
              href="https://github.com/optriment/optrispace-contract"
              passHref
            >
              <a
                href="https://github.com/optriment/optrispace-contract"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Smart Contracts
              </a>
            </Link>
          </List.Item>
          <List.Item>
            All of our code is{' '}
            <Link href="https://github.com/optriment" passHref>
              <a
                href="https://github.com/optriment"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                open source
              </a>
            </Link>
          </List.Item>
          <List.Item>All payments in crypto</List.Item>
          <List.Item>No paperwork</List.Item>
          <List.Item>No middlemen</List.Item>
        </List>

        <Header as="h2" content="What network do we use?" />

        <p>
          Binance Smart Chain.
          <br />
          Our main currency is the native currency of this network (BNB).
        </p>
      </Container>
    </>
  )
}
