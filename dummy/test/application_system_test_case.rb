require "test_helper"

module Selenium
  module WebDriver
    module Chrome
      class Driver
        include Selenium::WebDriver::DriverExtensions::HasLogs
      end
    end
  end
end

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1000, 1000] do |options|
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-browser-side-navigation")
    options.add_argument("--proxy-server='direct://'")
    options.add_argument("--proxy-bypass-list=*")
  end

  teardown do
    next if passed?

    logs = page.driver.browser.logs.get(:browser)
    if logs.present?
      message = logs.map(&:message)
        .reject { |m| m.include? 'unknown prop' }
        .reject { |m| m.include? 'unexpected slot' }
        .join("\n")
      puts message
    end
  end
end
