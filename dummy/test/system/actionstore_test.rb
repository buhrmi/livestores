require "application_system_test_case"

class SanityTest < ApplicationSystemTestCase

  test 'can log in and out' do
    visit '/'
    assert_text 'henlo'
    click_on 'Make Message'
    assert_text 'Hello World'
  end
end