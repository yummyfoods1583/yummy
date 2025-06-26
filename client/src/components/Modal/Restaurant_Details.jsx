import React from "react"

const Restaurant_Details = ({ restaurant }) => {
  return (
    <>
      <div
        class="modal fade"
        id={`rest_details_${restaurant.rest_id}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Details
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Details:{restaurant.rest_details}</div>
            <div class="modal-body">
              Manager name: {restaurant.manager_name}
            </div>
            <div class="modal-body">Address: {restaurant.detailed_address}</div>
            <div class="modal-body">Mobile: {restaurant.mobile}</div>
            <div class="modal-body">Email: {restaurant.email}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Restaurant_Details
