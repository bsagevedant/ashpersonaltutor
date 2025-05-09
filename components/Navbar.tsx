        <div className="flex items-center space-x-4">
          <a
            href="https://x.com/sagevedant"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
          >
            @sagevedant
          </a>
          <button
            onClick={() => {
              const isDarkMode = document.body.classList.toggle('dark-mode');
              localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
            }}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            style={{ backgroundColor: '#e5e7eb' }}
          >
            Toggle Dark/Light Mode
          </button>
          {/* Other navbar items */}
        </div> 