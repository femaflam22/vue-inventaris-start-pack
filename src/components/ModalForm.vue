<template>
    <div v-if="isModalOpen" class="modal show d-block fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ modalTitle }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('close-modal')"></button>
            </div>
            <div class="modal-body">
                <!-- mengisi konten HTML dinamis -->
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('close-modal')">Close</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'ModalFormComponent',
    props: {
        // mengecek modal dimunculkan/tdk
        isModalOpen: {
            type: Boolean,
            default: false
        },
        // mengisi judul modal
        modalTitle: {
            type: String,
            required: true,
        }
    }
}
</script>