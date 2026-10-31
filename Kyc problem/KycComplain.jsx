import ComplainForm from '../../components/ComplainForm'

/** KYC Complain — form ka saara logic ComplainForm me hai. */
export default function KycComplain() {
  return (
    <ComplainForm
      type="KYC"
      title="KYC Complain"
  files={[
    { key: 'aadharFront', label: 'Upload Aadhar / Pan Card Front' },
    { key: 'aadharBack', label: 'Upload Aadhar / Pan Card Back' },
  ]}
      requiredFilesMessage="Please upload both front/back images"
    />
  )
}
