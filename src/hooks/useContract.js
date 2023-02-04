import { ethers } from 'ethers'
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractEvent,
} from 'wagmi'

import gigsAcceptContractCommandABI from '../../contracts/GigsAcceptContractCommand.json'
import gigsFundContractCommandABI from '../../contracts/GigsFundContractCommand.json'
import gigsStartContractCommandABI from '../../contracts/GigsStartContractCommand.json'
import gigsDeliverContractCommandABI from '../../contracts/GigsDeliverContractCommand.json'
import gigsApproveContractCommandABI from '../../contracts/GigsApproveContractCommand.json'
import gigsDeclineContractCommandABI from '../../contracts/GigsDeclineContractCommand.json'
import gigsWithdrawContractCommandABI from '../../contracts/GigsWithdrawContractCommand.json'
import gigsRefundContractCommandABI from '../../contracts/GigsRefundContractCommand.json'

const parseEther = (value) => {
  return ethers.utils.parseEther(parseFloat(value.toString()).toString())
}

const GAS_LIMIT = 1000000

export const useContract = ({
  optriSpaceContractAddress,
  contract,
  currentAccount,
  onContractAccepted,
  onContractFunded,
  onContractStarted,
  onContractDelivered,
  onContractApproved,
  onContractDeclined,
  onContractWithdrew,
  onContractRefunded,
}) => {
  const currentStatus = contract.status

  const isAcceptAllowed = currentStatus === 'created'
  const isFundAllowed = currentStatus === 'accepted'
  const isStartAllowed = currentStatus === 'funded'
  const isDeliverAllowed = currentStatus === 'started'
  const isApproveAllowed =
    currentStatus === 'started' || currentStatus === 'delivered'
  const isDeclineAllowed = currentStatus === 'delivered'
  const isRefundAllowed =
    (currentStatus === 'funded' && contract.remainingTimeToStartWork <= 0) ||
    (currentStatus === 'started' &&
      contract.remainingTimeToDeliverResult <= 0) ||
    currentStatus === 'declined'
  const isWithdrawAllowed = currentStatus === 'approved'

  //
  // Accept
  //
  const { config: acceptConfig, error: acceptPrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsAcceptContractCommandABI,
      functionName: 'gigsAcceptContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.contractorAddress && isAcceptAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: acceptError,
    isLoading: contractAccepting,
    isSuccess: contractAccepted,
    write: writeAccept,
  } = useContractWrite(acceptConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsAcceptContractCommandABI,
    eventName: 'ContractAccepted',
    listener(contractAddress) {
      if (!contractAccepted) return
      if (contractAddress !== contract.address) return

      onContractAccepted()
    },
  })

  //
  // Fund
  //
  const { config: fundConfig, error: fundPrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsFundContractCommandABI,
      functionName: 'gigsFundContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.customerAddress && isFundAllowed,
      overrides: {
        from: currentAccount,
        value: parseEther(contract.value),
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: fundError,
    isLoading: contractFunding,
    isSuccess: contractFunded,
    write: writeFund,
  } = useContractWrite(fundConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsFundContractCommandABI,
    eventName: 'ContractFunded',
    listener(contractAddress) {
      if (!contractFunded) return
      if (contractAddress !== contract.address) return

      onContractFunded()
    },
  })

  //
  // Start
  //
  const { config: startConfig, error: startPrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsStartContractCommandABI,
      functionName: 'gigsStartContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.contractorAddress && isStartAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: startError,
    isLoading: contractStarting,
    isSuccess: contractStarted,
    write: writeStart,
  } = useContractWrite(startConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsStartContractCommandABI,
    eventName: 'ContractStarted',
    listener(contractAddress) {
      if (!contractStarted) return
      if (contractAddress !== contract.address) return

      onContractStarted()
    },
  })

  //
  // Deliver
  //
  const { config: deliverConfig, error: deliverPrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsDeliverContractCommandABI,
      functionName: 'gigsDeliverContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.contractorAddress && isDeliverAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: deliverError,
    isLoading: contractDelivering,
    isSuccess: contractDelivered,
    write: writeDeliver,
  } = useContractWrite(deliverConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsDeliverContractCommandABI,
    eventName: 'ContractDelivered',
    listener(contractAddress) {
      if (!contractDelivered) return
      if (contractAddress !== contract.address) return

      onContractDelivered()
    },
  })

  //
  // Approve
  //
  const { config: approveConfig, error: approvePrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsApproveContractCommandABI,
      functionName: 'gigsApproveContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.customerAddress && isApproveAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: approveError,
    isLoading: contractApproving,
    isSuccess: contractApproved,
    write: writeApprove,
  } = useContractWrite(approveConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsApproveContractCommandABI,
    eventName: 'ContractApproved',
    listener(contractAddress) {
      if (!contractApproved) return
      if (contractAddress !== contract.address) return

      onContractApproved()
    },
  })

  //
  // Decline
  //
  const { config: declineConfig, error: declinePrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsDeclineContractCommandABI,
      functionName: 'gigsDeclineContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.customerAddress && isDeclineAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: declineError,
    isLoading: contractDeclining,
    isSuccess: contractDeclined,
    write: writeDecline,
  } = useContractWrite(declineConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsDeclineContractCommandABI,
    eventName: 'ContractDeclined',
    listener(contractAddress) {
      if (!contractDeclined) return
      if (contractAddress !== contract.address) return

      onContractDeclined()
    },
  })

  //
  // Withdraw
  //
  const { config: withdrawConfig, error: withdrawPrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsWithdrawContractCommandABI,
      functionName: 'gigsWithdrawContract',
      args: [contract.address],
      mode: 'prepared',
      enabled:
        currentAccount == contract.contractorAddress && isWithdrawAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: withdrawError,
    isLoading: contractWithdrawing,
    isSuccess: contractWithdrew,
    write: writeWithdraw,
  } = useContractWrite(withdrawConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsWithdrawContractCommandABI,
    eventName: 'ContractWithdrew',
    listener(contractAddress) {
      if (!contractWithdrew) return
      if (contractAddress !== contract.address) return

      onContractWithdrew()
    },
  })

  //
  // Refund
  //
  const { config: refundConfig, error: refundPrepareError } =
    usePrepareContractWrite({
      address: optriSpaceContractAddress,
      abi: gigsRefundContractCommandABI,
      functionName: 'gigsRefundContract',
      args: [contract.address],
      mode: 'prepared',
      enabled: currentAccount == contract.customerAddress && isRefundAllowed,
      overrides: {
        from: currentAccount,
        gasLimit: GAS_LIMIT,
      },
    })

  const {
    error: refundError,
    isLoading: contractRefunding,
    isSuccess: contractRefunded,
    write: writeRefund,
  } = useContractWrite(refundConfig)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsRefundContractCommandABI,
    eventName: 'ContractRefunded',
    listener(contractAddress) {
      if (!contractRefunded) return
      if (contractAddress !== contract.address) return

      onContractRefunded()
    },
  })

  return {
    isAcceptAllowed,
    isFundAllowed,
    isStartAllowed,
    isDeliverAllowed,
    isApproveAllowed,
    isDeclineAllowed,
    isRefundAllowed,
    isWithdrawAllowed,

    // Accept
    acceptPrepareError,
    acceptError,
    contractAccepting,
    contractAccepted,
    writeAccept,

    // Fund
    fundPrepareError,
    fundError,
    contractFunding,
    contractFunded,
    writeFund,

    // Start
    startPrepareError,
    startError,
    contractStarting,
    contractStarted,
    writeStart,

    // Deliver
    deliverPrepareError,
    deliverError,
    contractDelivering,
    contractDelivered,
    writeDeliver,

    // Approve
    approvePrepareError,
    approveError,
    contractApproving,
    contractApproved,
    writeApprove,

    // Decline
    declinePrepareError,
    declineError,
    contractDeclining,
    contractDeclined,
    writeDecline,

    // Withdraw
    withdrawPrepareError,
    withdrawError,
    contractWithdrawing,
    contractWithdrew,
    writeWithdraw,

    // Refund
    refundPrepareError,
    refundError,
    contractRefunding,
    contractRefunded,
    writeRefund,
  }
}
