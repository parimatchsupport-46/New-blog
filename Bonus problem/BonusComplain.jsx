import ComplainForm from '../../components/ComplainForm'

/** Bonus Complain — form ka saara logic ComplainForm me hai. */
export default function BonusComplain() {
  return (
    <ComplainForm
      type="Bonus"
      title="Bonus Complain"
  files={[
    { key: 'aadharFront', label: 'Upload Aadhar Card Front' },
    { key: 'aadharBack', label: 'Upload Aadhar Card Back' },
    { key: 'paymentImage', label: 'Upload Payment Image' },
  ]}
      requiredFilesMessage="Please upload all required images"
    />
  )
}
