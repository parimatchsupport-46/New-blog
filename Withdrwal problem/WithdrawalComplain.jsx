import ComplainForm from '../../components/ComplainForm'

/** Withdrawal Complain — form ka saara logic ComplainForm me hai. */
export default function WithdrawalComplain() {
  return (
    <ComplainForm
      type="Withdrawal"
      title="Withdrawal Complain"
  amount={{ key: 'withdrawalAmount', label: 'Withdrawal Amount' }}
  files={[{ key: 'issueImage', label: 'Upload Issue Image' }]}
      requiredFilesMessage="Please upload Issue Image"
    />
  )
}
