import React, { useEffect, useState } from "react"
import YummyDataFetch from "../Api/YummyDataFetch"
import { useParams } from "react-router-dom"

const Profile = () => {
  const [current_user, setCurrentUser] = useState(null)
  const param = useParams()
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await YummyDataFetch.get(
        `/${param.user_type}/${param.id}/profile`,
        { withCredentials: true }
      )
      console.log(response.data.data.user)
      setCurrentUser(response.data.data.user)
    }
    fetchUserData()
  }, [])
  return (
    <>
      {current_user === null && <div>No Data Found!!!</div>}
      {current_user !== null && (
        <>
          <div className="container-fluid mt-1">
            <h2 className="text-center">{current_user.name}</h2>
          </div>
          <div className="container-fluid d-flex justify-content-center mt-4">
            <img
              src={current_user.photo_url || "/Images/No_Image.jpg"}
              alt="User Image"
              width={"250px"}
              height={"250px"}
              className="border rounded-circle"
            />
          </div>
          <div className="container-fluid mt-5">
            <table className="table table-striped table-bordered">
              <tbody className="text-center">
                {/*General Information for all users */}
                <tr>
                  <th>User Id</th>
                  <td> {current_user.user_id}</td>
                </tr>
                <tr>
                  <th>User Type</th>
                  <td> {current_user.user_type}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td> {current_user.name}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td> {current_user.mobile}</td>
                </tr>
                {/*Information for admin */}
                {current_user.user_type === "ADM" && (
                  <>
                    <tr>
                      <th>Email</th>
                      <td>{current_user.email}</td>
                    </tr>
                    <tr>
                      <th>Commission PCT</th>
                      <td>{current_user.commission_pct}</td>
                    </tr>
                  </>
                )}

                {/*Information for customer */}
                {current_user.user_type === "CUS" && (
                  <>
                    {current_user.email && (
                      <tr>
                        <th>Email</th>
                        <td>{current_user.email}</td>
                      </tr>
                    )}
                    {current_user.photo_url && (
                      <tr>
                        <th>Photo Url</th>
                        <td>
                          <a href={current_user.photo_url}>
                            {current_user.photo_url}
                          </a>
                        </td>
                      </tr>
                    )}
                    {current_user.details && (
                      <tr>
                        <th>Details</th>
                        <td>{current_user.details}</td>
                      </tr>
                    )}
                    {current_user.address && (
                      <tr>
                        <th>Address</th>
                        <td>{current_user.address}</td>
                      </tr>
                    )}
                  </>
                )}

                {/*Information for Restaurant */}
                {current_user.user_type === "RES" && (
                  <>
                    {current_user.email && (
                      <tr>
                        <th>Email</th>
                        <td>{current_user.email}</td>
                      </tr>
                    )}
                    {current_user.opening_time && (
                      <tr>
                        <th>Daily Opening Time</th>
                        <td>
                          {new Date(
                            current_user.opening_time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    )}
                    {current_user.closing_time && (
                      <tr>
                        <th>Daily Closing Time</th>
                        <td>
                          {new Date(
                            current_user.closing_time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    )}
                    {current_user.close_until && (
                      <tr>
                        <th className="text-danger">
                          The Restaurant is closed Until
                        </th>
                        <td className="text-danger">
                          {new Date(current_user.close_until).toLocaleString(
                            [],
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                      </tr>
                    )}
                    {current_user.rest_details && (
                      <tr>
                        <th>Restaurant Details</th>
                        <td>{current_user.rest_details}</td>
                      </tr>
                    )}
                    {current_user.manager_name && (
                      <tr>
                        <th>Manager Name</th>
                        <td>{current_user.manager_name}</td>
                      </tr>
                    )}
                    {current_user.photo_url && (
                      <tr>
                        <th>Photo Url</th>
                        <td>
                          <a href={current_user.photo_url}>
                            {current_user.photo_url}
                          </a>
                        </td>
                      </tr>
                    )}
                    {current_user.payment_method && (
                      <tr>
                        <th>Payment Method</th>
                        <td>
                          {current_user.payment_method === "BOTH"
                            ? "COD+Online"
                            : current_user.payment_method}
                        </td>
                      </tr>
                    )}
                    {current_user.rating && (
                      <tr>
                        <th>Rating</th>
                        <td>{current_user.rating}</td>
                      </tr>
                    )}
                    {current_user.detailed_address && (
                      <tr>
                        <th>Detailed Address</th>
                        <td>{current_user.detailed_address}</td>
                      </tr>
                    )}
                  </>
                )}

                {/*Information for Rider*/}
                {current_user.user_type === "RID" && (
                  <>
                    {current_user.address && (
                      <tr>
                        <th>Current Address</th>
                        <td>{current_user.address}</td>
                      </tr>
                    )}{" "}
                    {current_user.email && (
                      <tr>
                        <th>Email</th>
                        <td>{current_user.email}</td>
                      </tr>
                    )}
                    {current_user.rider_details && (
                      <tr>
                        <th>Details</th>
                        <td>{current_user.rider_details}</td>
                      </tr>
                    )}
                    {current_user.photo_url && (
                      <tr>
                        <th>Photo Url</th>
                        <td>
                          <a href={current_user.photo_url}>
                            {current_user.photo_url}
                          </a>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default Profile
