document.addEventListener('DOMContentLoaded', () => {
    const queueForm = document.getElementById('queue-form');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const formMessage = document.getElementById('form-message');
    const myQueueNumber = document.getElementById('my-queue-number');
    const adminQueueUl = document.getElementById('admin-queue-ul');
    const callNextBtn = document.getElementById('call-next-btn');
    const resetBtn = document.getElementById('reset-btn');

    let queue = [];
    const STORAGE_KEY = 'onlineQueue';

    // โหลดข้อมูลคิวจาก Local Storage เมื่อเปิดหน้าเว็บ
    function loadQueue() {
        const storedQueue = localStorage.getItem(STORAGE_KEY);
        if (storedQueue) {
            queue = JSON.parse(storedQueue);
        }
    }

    // บันทึกข้อมูลคิวลง Local Storage
    function saveQueue() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }

    // แสดงรายการคิวในแผงควบคุมผู้ดูแลระบบ
    function renderAdminQueue() {
        adminQueueUl.innerHTML = '';
        if (queue.length === 0) {
            adminQueueUl.innerHTML = '<li>ยังไม่มีคิว</li>';
            return;
        }

        queue.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>คิวที่ ${index + 1}: ${item.name} (${item.phone})</span>
                <div>
                    <button class="call-btn" data-index="${index}">เรียกคิว</button>
                    <button class="remove-btn" data-index="${index}">ยกเลิก</button>
                </div>
            `;
            adminQueueUl.appendChild(li);
        });

        // เพิ่ม Event Listeners สำหรับปุ่มในรายการคิว
        document.querySelectorAll('.call-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                callQueue(index);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                removeQueue(index);
            });
        });
    }

    // ฟังก์ชันสำหรับผู้ใช้จองคิว
    queueForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ตรวจสอบความถูกต้องของข้อมูล
        if (!nameInput.value || !phoneInput.value) {
            displayMessage(formMessage, 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }
        if (!phoneInput.checkValidity()) {
            displayMessage(formMessage, 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 0812345678)', 'error');
            return;
        }

        const newQueueItem = {
            name: nameInput.value,
            phone: phoneInput.value,
            timestamp: new Date().toISOString()
        };

        queue.push(newQueueItem);
        saveQueue();
        renderAdminQueue();
        displayMessage(formMessage, `คุณได้คิวที่ ${queue.length} แล้ว!`, 'success');
        myQueueNumber.textContent = `คิวของคุณ: ${queue.length}`;
        queueForm.reset();
    });

    // ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
    function displayMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 5000);
    }

    // ฟังก์ชันสำหรับเรียกคิว
    function callQueue(index) {
        if (queue.length === 0) {
            alert('ไม่มีคิวให้เรียกแล้ว');
            return;
        }
        const calledItem = queue.splice(index, 1)[0];
        alert(`เรียกคิวที่ ${parseInt(index) + 1}: คุณ ${calledItem.name} โปรดเตรียมตัว`);
        saveQueue();
        renderAdminQueue();
    }

    // ฟังก์ชันสำหรับยกเลิกคิว
    function removeQueue(index) {
        const removedItem = queue.splice(index, 1)[0];
        alert(`ยกเลิกคิวของ คุณ ${removedItem.name} แล้ว`);
        saveQueue();
        renderAdminQueue();
    }

    // ปุ่มเรียกคิวถัดไป (คิวแรกสุด)
    callNextBtn.addEventListener('click', () => {
        if (queue.length > 0) {
            callQueue(0);
        } else {
            alert('ไม่มีคิวให้เรียกแล้ว');
        }
    });

    // ปุ่มรีเซ็ตคิวทั้งหมด
    resetBtn.addEventListener('click', () => {
        if (confirm('คุณต้องการรีเซ็ตคิวทั้งหมดใช่หรือไม่?')) {
            queue = [];
            saveQueue();
            renderAdminQueue();
            alert('รีเซ็ตคิวทั้งหมดเรียบร้อยแล้ว');
            myQueueNumber.textContent = '';
        }
    });

    // เริ่มต้นระบบ: โหลดข้อมูลและแสดงผล
    loadQueue();
    renderAdminQueue();
});