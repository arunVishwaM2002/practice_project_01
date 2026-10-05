import { useCity } from '@/context/city'
import { Modal } from '@/components/ui/Modal'
import { getCities } from '@/services/catalog'
import { CitySelector } from './CitySelector'

export function CityPickerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { city, setCityId } = useCity()
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select your city"
      description="We'll show cinemas and showtimes near you."
      size="lg"
    >
      <CitySelector
        cities={getCities()}
        selectedId={city.id}
        layout="grid"
        onSelect={(id) => {
          setCityId(id)
          onClose()
        }}
      />
    </Modal>
  )
}
