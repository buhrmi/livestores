require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome do |options|
    options.add_argument('--no-sandbox')
  end

  teardown do 
    next if passed?
    logs = page.driver.browser.logs.get(:browser)
    if logs.present?
      message = logs.map(&:message).reject { |m| m.include? 'unknown prop' }.reject { |m| m.include? 'unexpected slot' }.join("\n")
      puts message
    end
  end
end