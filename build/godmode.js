//godmode.js
export default class Godmode {
    constructor(config) {
        this.config = config;
        this.initialize();
        this.toggleModal();
    }

    initialize() {
        // Create a new <div> element
        this.configModal = document.createElement('div');
        this.configModal.className = 'modal fade';
        this.configModal.id = 'configModal';
        this.configModal.tabIndex = -1;
        this.configModal.setAttribute('role', 'dialog');
        this.configModal.setAttribute('aria-labelledby', 'configModal');
        this.configModal.setAttribute('aria-hidden', 'true');
            
        // Set the inner HTML for the modal
        this.configModal.innerHTML = `
=                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="configModalLabel">GodMode</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <label for="backgroundColor">Background Color:</label>
                            <input type="color" id="bgColorInput" name="backgroundColor">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button id="saveButton" type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
        `;
    
        document.body.appendChild(this.configModal);
    
        this.saveButton = document.getElementById('saveButton');
        this.saveButton.addEventListener('click', () => this.saveChanges());
        this.colorInput = document.getElementById('bgColorInput');
        this.colorInput.value = this.config.bgColor;
        this.colorInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                // If Enter key is pressed, save changes and close the modal
                this.saveChanges();
                this.toggleModal();
            }
        });
    }
    
    // initialize() {
    //     this.configModal = document.createElement();
    //     this.configModal.innerHTML = `
    //     <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    //     <div class="modal-dialog" role="document">
    //       <div class="modal-content">
    //         <div class="modal-header">
    //           <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
    //           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    //             <span aria-hidden="true">&times;</span>
    //           </button>
    //         </div>
    //         <div class="modal-body">
    //                         <label for="backgroundColor">Background Color:</label>
    //                         <input type="color" id="bgColorInput" name="backgroundColor">
    //             </div>
    //         <div class="modal-footer">
    //           <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    //           <button type="button" class="btn btn-primary">Save changes</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //     `;
    //     document.body.appendChild(this.configModal);
    //     this.saveButton = document.getElementById('saveButton');
    //     // this.saveButton.addEventListener('click', () => this.saveChanges());
    //     this.colorInput = document.getElementById('bgColorInput');
    //     this.colorInput.value = this.config.bgColor;
    // }

    toggleModal(){
        $(this.configModal).modal('toggle'); // This will show the modal if it's hidden or hide it if it's shown
    }

    saveChanges() {
        this.config.bgColor = this.colorInput.value;
    }
}

