import { useEffect, useState } from 'react';
import supabase from '../supabase';


export default function Image({ size }) {
    const [imageURL, setImageURL] = useState(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (imageURL) downloadImage(imageURL)
    }, [imageURL])

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('images').download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            setImageURL(url)
        }
        catch (error) {
            console.log('error downloading image: ', error.message)
        }
    }

    async function uploadImage(e) {
        try {
            setUploading(true)

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error("must select an image to upload.")
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`
            console.log(fileName)

            let { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            setImageURL(filePath)
        }
        catch (error) {
            alert(error.message)
        }
        finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {imageURL ? (
                <img
                    src={imageURL}
                    alt="Image"
                    className="example image"
                    style={{ height: size, width: size }}
                />
            ) : (
                <div className="no image" style={{ height: size, width: size }} />
            )}
            <div style={{ width: size }}>
                <label className="button primary block" htmlFor="single">
                    {uploading ? 'Uploading ...' : 'Upload'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}