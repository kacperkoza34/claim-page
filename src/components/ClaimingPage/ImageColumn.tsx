import { useState } from 'react'
import useContractState from '@src/utils/hooks/useContractState'

export const ImageColumn: React.FC = () => {
  const { previewImage } = useContractState()
  const [error, setError] = useState(false)

  const handleImageError = () => setError(true)

  return (
    <div className='w-[274px] h-[274px] mx-auto'>
      {error || !previewImage ? (
        <div className='w-full h-full flex justify-center items-center border'>
          <h3>No image</h3>
        </div>
      ) : (
        <img className='w-full h-full object-cover' onError={handleImageError} src={previewImage || undefined} alt='nft image' />
      )}
    </div>
  )
}
