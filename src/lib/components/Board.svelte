<div class="flex w-full flex-col items-center px-4">
    <div class="w-full rounded-lg px-4 pb-4 md:w-4/5">
        <div class="mb-4 border-b-2 border-gray-500 py-4">
            <slot name="title" />
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <slot name="items" />
        </div>
    </div>
</div>
