import { useState } from 'react'
import { DatePicker, Select } from 'antd'
import moment from 'moment'
import { toast } from 'react-toastify'

const { Option } = Select

const HotelEditForm = ({
    values,
    setValues,
    handleChange,
    handleImageChange,
    handleSubmit    
    
}) => {
    const { title, content, price, bed, from, to, location } = values
    const [saveButton, setSaveButton] = useState(false)

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="btn btn-outline-primary btn-block m-2 text-left">
                    Image
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        hidden
                    />
                </label>

                <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    placeholder="Title"
                    className="form-control m-2"
                    value={title}
                />

                <textarea
                    name="content"
                    onChange={handleChange}
                    placeholder="Content"
                    className="form-control m-2"
                    value={content}
                />
                
                {location && location.length && (
                    <input
                        type="text"
                        name="location"
                        onChange={handleChange}
                        placeholder="Location"
                        className="form-control m-2"
                        value={location}
                    />
                )}               

                <input
                    type="number"
                    name="price"
                    onChange={handleChange}
                    placeholder="Price"
                    className="form-control m-2"
                    value={price}
                />

                <Select
                    onChange={(value) => setValues({ ...values, bed: value })}
                    className="w-100 m-2"
                    size="large"
                    placeholder="Number of beds"
                    value={bed}
                >
                    <Option key={1}>{1}</Option>
                    <Option key={2}>{2}</Option>
                    <Option key={3}>{3}</Option>
                    <Option key={4}>{4}</Option>
                </Select>
            </div>

            {from && (                
                <DatePicker
                    size="large"
                    defaultValue={moment(from, "YYYY-MM-DD")}
                    format="DD-MM-YYYY"
                    placeholder={values.from}
                    className="form-control m-2"
                    onChange={(dateString) => {                         
                        dateString = moment(dateString, "DD-MM-YYYY")
                        dateString.set({ h: 15, m: 11 })
                        if (moment(dateString).isSame(values.to, 'day')) {
                            setSaveButton(true)
                            toast.error("Error: Cannot select duplicate dates")
                            setTimeout(function () {
                                setTimeout(window.location.reload())
                            }, 3000)
                        } else if (moment(dateString).isAfter(values.to, 'day')) {
                            setSaveButton(true)
                            toast.error("Error: Cannot select a from date that is after the end date")
                            setTimeout(function () {
                                setTimeout(window.location.reload())
                            }, 3000)
                        } else { 
                            dateString = moment(dateString).format()
                            setValues({ ...values, from: dateString })
                        }
                    }}                    
                    disabledDate={(current) =>                         
                        current && current.valueOf() < moment().subtract(1, "days")
                    }
                />
            )}

            {to && (                
                <DatePicker
                    size="large"
                    defaultValue={moment(to, "YYYY-MM-DD")}
                    format="DD-MM-YYYY"
                    placeholder={values.to}
                    className="form-control m-2"
                    onChange={(dateString) => {
                        dateString = moment(dateString, "DD-MM-YYYY")
                        dateString.set({ h: 18, m: 15 })
                        if (moment(dateString).isSame(values.from, 'day')) {
                            setSaveButton(true)
                            toast.error("Error: Cannot select duplicate dates")
                            setTimeout(function () {
                                setTimeout(window.location.reload())
                            }, 3000)
                        } else if (moment(dateString).isBefore(values.from)) {
                                setSaveButton(true)
                                toast.error("Error: Cannot select a to date that is before the from date")
                                setTimeout(function () {
                                    setTimeout(window.location.reload())
                                }, 3000)
                        } else {                            
                            setValues({ ...values, to: dateString })
                        }
                      }                        
                    }
                    disabledDate={(current) =>
                        current && current.valueOf() < moment().subtract(1, "days")
                    }
                />
            )}

            <button disabled={saveButton} className="btn btn-outline-primary m-2">Save</button>
        </form>

    )
}

export default HotelEditForm