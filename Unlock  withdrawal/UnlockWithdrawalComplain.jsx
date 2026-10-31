import ComplainForm from '../../components/ComplainForm'

/** Withdrawal Unlock Complain — form ka saara logic ComplainForm me hai. */
export default function UnlockWithdrawalComplain() {
  return (
    <ComplainForm
      type="Withdrawal Unlock"
      title="Withdrawal Unlock Complain"
  files={[
    { key: 'issueImage', label: 'Upload Issue Image' },
    { key: 'aadharFront', label: 'Upload Aadhar Card Front' },
    { key: 'aadharBack', label: 'Upload Aadhar Card Back' },
    { key: 'selfieWithId', label: 'Selfie Image with Pan/Aadhar Card' }
  ]}
      requiredFilesMessage="Please upload all required images"
    />
  )
}
